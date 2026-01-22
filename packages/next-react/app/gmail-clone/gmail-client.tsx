'use client'

import {
  Archive,
  Clock,
  File,
  Inbox,
  Mail,
  Menu,
  MoreVertical,
  PanelLeftClose,
  Pencil,
  RefreshCw,
  Search,
  Send,
  Star,
  Trash2,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  archiveEmail,
  archiveEmails,
  deleteEmail,
  deleteEmails,
  getEmails,
  markAsRead,
  toggleRead,
  toggleStar,
  type EmailWithParsedLabels,
} from './actions'

interface NavItem {
  icon: React.ElementType
  label: string
  count?: number
  active?: boolean
}

interface GmailClientProps {
  initialEmails: EmailWithParsedLabels[]
  initialUnreadCount: number
  initialStarredCount: number
}

/**
 * Formats a date for display in email list
 * @param date - Date to format
 * @returns Formatted date string (e.g., "10:30 AM", "Yesterday", "Jan 18")
 */
const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const oneDay = 24 * 60 * 60 * 1000

  if (diff < oneDay && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (diff < 2 * oneDay && date.getDate() === now.getDate() - 1) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Gmail Clone client component with real-time CRUD operations
 * Uses Server Actions for database operations
 */
export function GmailClient({
  initialEmails,
  initialUnreadCount,
  initialStarredCount,
}: GmailClientProps) {
  const [emails, setEmails] =
    React.useState<EmailWithParsedLabels[]>(initialEmails)
  const [selectedEmail, setSelectedEmail] =
    React.useState<EmailWithParsedLabels | null>(initialEmails[0] ?? null)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [unreadCount, setUnreadCount] = React.useState(initialUnreadCount)
  const [starredCount, setStarredCount] = React.useState(initialStarredCount)

  const navItems: NavItem[] = [
    { icon: Inbox, label: 'Inbox', count: unreadCount, active: true },
    { icon: Star, label: 'Starred', count: starredCount },
    { icon: Clock, label: 'Snoozed' },
    { icon: Send, label: 'Sent' },
    { icon: File, label: 'Drafts', count: 0 },
    { icon: Archive, label: 'Archive' },
    { icon: Trash2, label: 'Trash' },
  ]

  /**
   * Toggles sidebar visibility
   */
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev
      toast.success(newState ? 'Sidebar expanded' : 'Sidebar collapsed')
      return newState
    })
  }

  /**
   * Refreshes email list from database
   */
  const handleRefresh = async () => {
    try {
      const freshEmails = await getEmails()
      setEmails(freshEmails)
      toast.success('Inbox refreshed')
    } catch (error) {
      toast.error('Failed to refresh inbox')
      console.error(error)
    }
  }

  /**
   * Toggles the starred status of an email
   * @param emailId - The ID of the email to toggle
   */
  const handleToggleStar = async (emailId: string) => {
    try {
      const updated = await toggleStar(emailId)
      setEmails((prev) =>
        prev.map((email) => (email.id === emailId ? updated : email)),
      )
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(updated)
      }
      setStarredCount((prev) => (updated.starred ? prev + 1 : prev - 1))
      toast.success(
        updated.starred ? 'Added to starred' : 'Removed from starred',
      )
    } catch (error) {
      toast.error('Failed to toggle star')
      console.error(error)
    }
  }

  /**
   * Archives the selected emails
   */
  const handleArchive = async () => {
    try {
      if (selectedIds.size === 0 && selectedEmail) {
        const archived = await archiveEmail(selectedEmail.id)
        setEmails((prev) => prev.filter((e) => e.id !== archived.id))
        setSelectedEmail(null)
        if (!archived.read) {
          setUnreadCount((prev) => prev - 1)
        }
        if (archived.starred) {
          setStarredCount((prev) => prev - 1)
        }
        toast.success('Conversation archived', {
          action: {
            label: 'Undo',
            onClick: async () => {
              const freshEmails = await getEmails()
              setEmails(freshEmails)
              toast.info('Archive undone')
            },
          },
        })
      } else if (selectedIds.size > 0) {
        const result = await archiveEmails(Array.from(selectedIds))
        setEmails((prev) => prev.filter((e) => !selectedIds.has(e.id)))
        setSelectedIds(new Set())
        toast.success(`${result.count} conversations archived`, {
          action: {
            label: 'Undo',
            onClick: async () => {
              const freshEmails = await getEmails()
              setEmails(freshEmails)
              toast.info('Archive undone')
            },
          },
        })
      }
    } catch (error) {
      toast.error('Failed to archive')
      console.error(error)
    }
  }

  /**
   * Moves selected emails to trash (permanently deletes in this demo)
   */
  const handleDelete = async () => {
    try {
      if (selectedIds.size === 0 && selectedEmail) {
        const deleted = await deleteEmail(selectedEmail.id)
        setEmails((prev) => prev.filter((e) => e.id !== deleted.id))
        setSelectedEmail(null)
        if (!deleted.read) {
          setUnreadCount((prev) => prev - 1)
        }
        if (deleted.starred) {
          setStarredCount((prev) => prev - 1)
        }
        toast.success('Conversation moved to Trash')
      } else if (selectedIds.size > 0) {
        const result = await deleteEmails(Array.from(selectedIds))
        setEmails((prev) => prev.filter((e) => !selectedIds.has(e.id)))
        setSelectedIds(new Set())
        toast.success(`${result.count} conversations moved to Trash`)
      }
    } catch (error) {
      toast.error('Failed to delete')
      console.error(error)
    }
  }

  /**
   * Toggles email selection checkbox
   * @param emailId - The ID of the email to toggle selection
   */
  const handleToggleSelect = (emailId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(emailId)) {
        newSet.delete(emailId)
      } else {
        newSet.add(emailId)
      }
      return newSet
    })
  }

  /**
   * Marks the selected email as read/unread
   */
  const handleMarkAsRead = async () => {
    if (!selectedEmail) return

    try {
      const updated = await toggleRead(selectedEmail.id)
      setEmails((prev) =>
        prev.map((email) => (email.id === selectedEmail.id ? updated : email)),
      )
      setSelectedEmail(updated)
      setUnreadCount((prev) => (updated.read ? prev - 1 : prev + 1))
      toast.success(updated.read ? 'Marked as read' : 'Marked as unread')
    } catch (error) {
      toast.error('Failed to update read status')
      console.error(error)
    }
  }

  /**
   * Handles clicking on an email to select and mark as read
   */
  const handleEmailClick = async (email: EmailWithParsedLabels) => {
    setSelectedEmail(email)
    if (!email.read) {
      try {
        const updated = await markAsRead(email.id)
        setEmails((prev) => prev.map((e) => (e.id === email.id ? updated : e)))
        setSelectedEmail(updated)
        setUnreadCount((prev) => prev - 1)
      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          </TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-2">
          <Mail className="size-6 text-red-500" />
          <span className="text-xl font-semibold">Gmail Clone</span>
        </div>
        <div className="ml-auto flex flex-1 items-center gap-2 md:max-w-md lg:max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search mail..."
              className="pl-8"
            />
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex h-full flex-col gap-2 border-r bg-background p-2 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-56' : 'w-0 overflow-hidden border-r-0 p-0'
          }`}
        >
          <Button className="justify-start gap-2 whitespace-nowrap" size="lg">
            <Pencil className="size-4" />
            Compose
          </Button>
          <Separator className="my-2" />
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? 'secondary' : 'ghost'}
                className="justify-start gap-2 whitespace-nowrap"
                size="sm"
              >
                <item.icon className="size-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {item.count}
                  </span>
                )}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Email List and Preview */}
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          {/* Email List */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="flex h-full flex-col">
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-b p-2">
                <Checkbox
                  checked={
                    selectedIds.size === emails.length && emails.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds(new Set(emails.map((e) => e.id)))
                    } else {
                      setSelectedIds(new Set())
                    }
                  }}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleArchive}
                      disabled={selectedIds.size === 0 && !selectedEmail}
                    >
                      <Archive className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleDelete}
                      disabled={selectedIds.size === 0 && !selectedEmail}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleMarkAsRead}>
                      Mark as {selectedEmail?.read ? 'unread' : 'read'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedIds(new Set())
                        toast.info('Selection cleared')
                      }}
                    >
                      Clear selection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="ml-auto text-xs text-muted-foreground">
                  {emails.length} emails
                </span>
              </div>

              {/* Email List */}
              <ScrollArea className="flex-1">
                <div className="flex flex-col">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      role="button"
                      tabIndex={0}
                      className={`flex cursor-pointer items-start gap-2 border-b p-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedEmail?.id === email.id ? 'bg-muted' : ''
                      } ${!email.read ? 'font-semibold' : ''}`}
                      onClick={async () => handleEmailClick(email)}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          await handleEmailClick(email)
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedIds.has(email.id)}
                        onCheckedChange={() => handleToggleSelect(email.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleStar(email.id)
                        }}
                      >
                        <Star
                          className={`size-4 ${
                            email.starred
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm">{email.from}</span>
                          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                            {formatDate(new Date(email.date))}
                          </span>
                        </div>
                        <div className="truncate text-sm">{email.subject}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {email.preview}
                        </div>
                        {email.labels.length > 0 && (
                          <div className="mt-1 flex gap-1">
                            {email.labels.map((label) => (
                              <Badge
                                key={label}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Email Preview */}
          <ResizablePanel defaultSize={50} minSize={30}>
            {selectedEmail ? (
              <div className="flex h-full flex-col">
                {/* Preview Header */}
                <div className="flex items-center gap-2 border-b p-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleArchive}
                      >
                        <Archive className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Archive</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleDelete}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" className="mx-1 h-6" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleMarkAsRead}>
                        Mark as {selectedEmail.read ? 'unread' : 'read'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => handleToggleStar(selectedEmail.id)}
                      >
                        {selectedEmail.starred
                          ? 'Remove from starred'
                          : 'Add to starred'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Preview Content */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <h1 className="text-xl font-semibold">
                      {selectedEmail.subject}
                    </h1>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedEmail.from.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {selectedEmail.from}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            &lt;{selectedEmail.email}&gt;
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          to me
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(selectedEmail.date))}
                      </span>
                    </div>
                    <Separator />
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {selectedEmail.body.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </ScrollArea>

                {/* Reply Section */}
                <div className="border-t p-4">
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 size-4" />
                    Reply
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Mail className="mx-auto size-12 opacity-50" />
                  <p className="mt-2">Select an email to read</p>
                </div>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
