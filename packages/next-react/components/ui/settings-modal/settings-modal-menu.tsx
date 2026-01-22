'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion'
import { ScrollArea } from '../scroll-area'

import { useSettingsModal } from './use-settings-modal'

/**
 * Container for the settings menu with scrollable area.
 * Renders as a vertical list on desktop, accordion on mobile.
 * @param className - Additional CSS classes.
 * @param children - Menu items or custom content.
 * @example
 * <SettingsModalMenu>
 *   <SettingsModalMenuItem id="account" />
 *   <SettingsModalMenuItem id="general" />
 * </SettingsModalMenu>
 */
function SettingsModalMenu({
  className,
  children,
  ...props
}: React.ComponentProps<'nav'>) {
  const { isMobile } = useSettingsModal()

  if (isMobile) {
    return (
      <nav
        data-slot="settings-modal-menu"
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </nav>
    )
  }

  return (
    <ScrollArea
      data-slot="settings-modal-menu"
      className={cn('w-56 shrink-0 border-r', className)}
    >
      <nav className="flex flex-col gap-1 p-4" {...props}>
        {children}
      </nav>
    </ScrollArea>
  )
}

/**
 * Individual menu item button with icon and badge support.
 * Follows Apple HIG with 44px minimum tap target.
 * @param id - Menu item ID (must match an item in the items array).
 * @param className - Additional CSS classes.
 * @example
 * <SettingsModalMenuItem id="account" />
 */
function SettingsModalMenuItem({
  id,
  className,
  ...props
}: { id: string } & Omit<React.ComponentProps<'button'>, 'id'>) {
  const { activeId, setActiveId, items } = useSettingsModal()
  const item = items.find((i) => i.id === id)

  if (!item) {
    console.warn(`SettingsModalMenuItem: No item found for id "${id}"`)
    return null
  }

  const isActive = activeId === id
  const Icon = item.icon

  return (
    <button
      data-slot="settings-modal-menu-item"
      data-state={isActive ? 'active' : 'inactive'}
      type="button"
      disabled={item.disabled}
      onClick={() => setActiveId(id)}
      className={cn(
        // Base styles - 44px min height for Apple HIG compliance
        'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium',
        // Transitions
        'transition-colors duration-150',
        // Focus states
        'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        // Default state
        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        // Active state
        'data-[state=active]:bg-accent data-[state=active]:text-accent-foreground',
        // Disabled state
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            'ml-auto rounded-full px-2 py-0.5 text-xs font-medium',
            'bg-primary/10 text-primary',
          )}
        >
          {item.badge}
        </span>
      )}
    </button>
  )
}

/**
 * Mobile-specific accordion menu that collapses to show current section.
 * Renders all menu items in an accordion with content inline.
 * @param children - Content panels to render inside accordion.
 * @param className - Additional CSS classes.
 * @example
 * <SettingsModalMobileMenu>
 *   <SettingsModalContent id="account">...</SettingsModalContent>
 *   <SettingsModalContent id="general">...</SettingsModalContent>
 * </SettingsModalMobileMenu>
 */
function SettingsModalMobileMenu({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { activeId, setActiveId, items } = useSettingsModal()

  return (
    <ScrollArea className="flex-1">
      <Accordion
        type="single"
        collapsible
        value={activeId}
        onValueChange={(value) => {
          if (value) setActiveId(value)
        }}
        className={cn('px-4', className)}
      >
        {items.map((item) => {
          const Icon = item.icon
          const contentChild = React.Children.toArray(children).find(
            (child): child is React.ReactElement<{ id: string }> =>
              React.isValidElement(child) &&
              (child.props as { id?: string }).id === item.id,
          )

          return (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger
                disabled={item.disabled}
                className={cn(
                  'min-h-11 hover:no-underline',
                  item.disabled && 'pointer-events-none opacity-50',
                )}
              >
                <span className="flex items-center gap-3">
                  {Icon && <Icon className="size-4 shrink-0" />}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>{contentChild}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </ScrollArea>
  )
}

export { SettingsModalMenu, SettingsModalMenuItem, SettingsModalMobileMenu }
