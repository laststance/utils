'use client'

import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

import { Dialog, DialogClose, DialogContent, DialogTitle } from '../dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../drawer'

import {
  SettingsModalMenu,
  SettingsModalMenuItem,
  SettingsModalMobileMenu,
} from './settings-modal-menu'
import {
  SettingsModalContext,
  type SettingsMenuItem,
} from './use-settings-modal'

/**
 * Props for the SettingsModal component.
 */
export type SettingsModalProps = {
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Menu items to display */
  items: SettingsMenuItem[]
  /** Initially selected item id */
  defaultItem?: string
  /** Modal title */
  title?: string
  /** Content panels */
  children: React.ReactNode
}

/**
 * Settings modal with responsive layout.
 * Desktop: Dialog with side menu + content panel.
 * Mobile: Drawer with accordion menu.
 *
 * @param open - Controlled open state.
 * @param onOpenChange - Callback when open state changes.
 * @param items - Menu items configuration.
 * @param defaultItem - Initially selected item (defaults to first item).
 * @param title - Modal title (defaults to "Settings").
 * @param children - SettingsModalContent components.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <SettingsModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   items={[
 *     { id: 'account', label: 'Account', icon: UserIcon },
 *     { id: 'general', label: 'General', icon: SettingsIcon },
 *   ]}
 *   defaultItem="account"
 *   title="Settings"
 * >
 *   <SettingsModalContent id="account">
 *     <AccountPanel />
 *   </SettingsModalContent>
 *   <SettingsModalContent id="general">
 *     <GeneralPanel />
 *   </SettingsModalContent>
 * </SettingsModal>
 * ```
 */
function SettingsModal({
  open,
  onOpenChange,
  items,
  defaultItem,
  title = 'Settings',
  children,
}: SettingsModalProps) {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState(defaultItem ?? items[0]?.id ?? '')

  const contextValue = React.useMemo(
    () => ({
      activeId,
      setActiveId,
      items,
      isMobile,
    }),
    [activeId, items, isMobile],
  )

  if (isMobile) {
    return (
      <SettingsModalContext value={contextValue}>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="relative border-b">
              <DrawerTitle className="text-center">{title}</DrawerTitle>
              <DrawerClose className="absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </DrawerHeader>
            <SettingsModalMobileMenu>{children}</SettingsModalMobileMenu>
          </DrawerContent>
        </Drawer>
      </SettingsModalContext>
    )
  }

  return (
    <SettingsModalContext value={contextValue}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            'flex h-[600px] max-h-[85vh] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0',
          )}
        >
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-6">
            <DialogTitle>{title}</DialogTitle>
            <DialogClose className="rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden">
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          {/* Body: Menu + Content */}
          <div className="flex min-h-0 flex-1">
            <SettingsModalMenu>
              {items.map((item) => (
                <SettingsModalMenuItem key={item.id} id={item.id} />
              ))}
            </SettingsModalMenu>
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </SettingsModalContext>
  )
}

export { SettingsModal }
