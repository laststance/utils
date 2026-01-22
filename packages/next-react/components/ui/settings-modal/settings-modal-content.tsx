'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { ScrollArea } from '../scroll-area'

import { useSettingsModal } from './use-settings-modal'

/**
 * Content panel for a specific settings section.
 * Only renders when its id matches the active menu item.
 * @param id - Must match a menu item id.
 * @param className - Additional CSS classes.
 * @param children - Content to display.
 * @example
 * <SettingsModalContent id="account">
 *   <h2>Account Settings</h2>
 *   <p>Manage your account...</p>
 * </SettingsModalContent>
 */
function SettingsModalContent({
  id,
  className,
  children,
  ...props
}: { id: string } & React.ComponentProps<'div'>) {
  const { activeId, isMobile } = useSettingsModal()
  const isActive = activeId === id

  // On mobile, content is rendered inline via accordion
  // On desktop, conditionally render based on activeId
  if (isMobile) {
    // Return children directly for mobile accordion to wrap
    return (
      <div
        data-slot="settings-modal-content"
        data-id={id}
        className={cn('py-2', className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (!isActive) {
    return null
  }

  return (
    <ScrollArea className="flex-1">
      <div
        data-slot="settings-modal-content"
        data-id={id}
        className={cn('animate-in fade-in-0 duration-200', 'p-6', className)}
        {...props}
      >
        {children}
      </div>
    </ScrollArea>
  )
}

/**
 * Header for a content section with title and optional description.
 * @param className - Additional CSS classes.
 * @param children - Title text or elements.
 * @example
 * <SettingsModalContentHeader>
 *   <SettingsModalContentTitle>Account</SettingsModalContentTitle>
 *   <SettingsModalContentDescription>
 *     Manage your profile and preferences
 *   </SettingsModalContentDescription>
 * </SettingsModalContentHeader>
 */
function SettingsModalContentHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="settings-modal-content-header"
      className={cn('mb-6 space-y-1', className)}
      {...props}
    />
  )
}

/**
 * Title for a content section.
 * @param className - Additional CSS classes.
 * @param children - Title text.
 */
function SettingsModalContentTitle({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="settings-modal-content-title"
      className={cn('text-lg font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

/**
 * Description text for a content section.
 * @param className - Additional CSS classes.
 * @param children - Description text.
 */
function SettingsModalContentDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="settings-modal-content-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

/**
 * Section divider within content panel.
 * @param className - Additional CSS classes.
 */
function SettingsModalContentDivider({
  className,
  ...props
}: React.ComponentProps<'hr'>) {
  return (
    <hr
      data-slot="settings-modal-content-divider"
      className={cn('my-6 border-border', className)}
      {...props}
    />
  )
}

/**
 * A labeled row for settings (label on left, control on right).
 * @param label - The setting label.
 * @param description - Optional description text.
 * @param className - Additional CSS classes.
 * @param children - Control element (button, toggle, input).
 * @example
 * <SettingsModalRow label="Dark Mode" description="Enable dark theme">
 *   <Switch checked={isDark} onCheckedChange={setIsDark} />
 * </SettingsModalRow>
 */
function SettingsModalRow({
  label,
  description,
  className,
  children,
  ...props
}: {
  label: string
  description?: string
} & React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="settings-modal-row"
      className={cn(
        'flex min-h-11 items-center justify-between gap-4 py-2',
        className,
      )}
      {...props}
    >
      <div className="space-y-0.5">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export {
  SettingsModalContent,
  SettingsModalContentHeader,
  SettingsModalContentTitle,
  SettingsModalContentDescription,
  SettingsModalContentDivider,
  SettingsModalRow,
}
