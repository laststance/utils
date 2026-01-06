'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

import { padding, shadows, radius } from '@/lib/design-system/spacing'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

export interface SidebarProps {
  children?: React.ReactNode
  className?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'floating' | 'minimal' | 'bold'
  position?: 'left' | 'right'
  collapsible?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  width?: 'sm' | 'md' | 'lg' | 'xl'
  overlay?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
}

const widthClasses = {
  sm: 'w-48',
  md: 'w-64',
  lg: 'w-80',
  xl: 'w-96',
}

const collapsedWidth = 'w-16'

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  theme = 'glass-clear',
  variant = 'default',
  position = 'left',
  collapsible = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  width = 'md',
  overlay = false,
  header,
  footer,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = controlledCollapsed ?? internalCollapsed

  const handleCollapse = () => {
    const newValue = !collapsed
    setInternalCollapsed(newValue)
    onCollapsedChange?.(newValue)
  }

  const selectedTheme = themes[theme]

  const variantClasses = {
    default: cn(
      selectedTheme?.card,
      selectedTheme?.border,
      position === 'left' ? 'border-r' : 'border-l',
      shadows.card,
    ),
    floating: cn(
      selectedTheme?.card,
      selectedTheme?.border,
      radius.xl,
      shadows['glass-elevated'],
      'm-4',
      'h-[calc(100vh-2rem)]',
    ),
    minimal: cn(
      'bg-background/50',
      'backdrop-blur-sm',
      position === 'left' ? 'border-r' : 'border-l',
      'border-border/30',
    ),
    bold: cn(
      selectedTheme?.background,
      selectedTheme?.border,
      position === 'left' ? 'border-r-2' : 'border-l-2',
      shadows.lg,
    ),
  }

  return (
    <>
      {/* Overlay for mobile */}
      {overlay && !collapsed && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleCollapse}
        />
      )}

      <aside
        className={cn(
          'h-full flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? collapsedWidth : widthClasses[width],
          position === 'left' ? 'left-0' : 'right-0',
          selectedTheme?.blur,
          variantClasses[variant],
          overlay && 'fixed top-0 z-50 h-screen',
          className,
        )}
      >
        {/* Header */}
        {header && (
          <div
            className={cn(
              'flex-shrink-0 border-b',
              selectedTheme?.border,
              collapsed ? 'p-2' : padding.card.sm,
            )}
          >
            {header}
          </div>
        )}

        {/* Collapse Button */}
        {collapsible && (
          <button
            type="button"
            onClick={handleCollapse}
            className={cn(
              'absolute top-4 -right-3 p-1.5 rounded-full',
              'bg-background border shadow-md',
              'hover:shadow-lg transition-all duration-200',
              'z-10',
              position === 'right' && '-left-3 -right-auto',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              position === 'left' ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronLeft size={14} />
              )
            ) : position === 'left' ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        )}

        {/* Content */}
        <div
          className={cn(
            'flex-1 overflow-y-auto',
            collapsed ? 'p-2' : padding.card.sm,
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              'flex-shrink-0 border-t',
              selectedTheme?.border,
              collapsed ? 'p-2' : padding.card.sm,
            )}
          >
            {footer}
          </div>
        )}
      </aside>
    </>
  )
}

Sidebar.displayName = 'Sidebar'

// Sidebar Item Component
export interface SidebarItemProps {
  icon?: React.ReactNode
  label: string
  href?: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
  badge?: React.ReactNode
  className?: string
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href = '#',
  active = false,
  collapsed = false,
  onClick,
  badge,
  className,
}) => {
  const Component = href ? 'a' : 'button'

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center w-full rounded-lg transition-all duration-200',
        collapsed ? 'p-3 justify-center' : 'px-3 py-2.5 justify-between',
        active
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5',
        className,
      )}
      title={collapsed ? label : undefined}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={cn('flex-shrink-0', collapsed && 'mx-auto')}>
            {icon}
          </span>
        )}
        {!collapsed && (
          <span className={typography.subheadline.className}>{label}</span>
        )}
      </div>
      {!collapsed && badge && <span className="flex-shrink-0">{badge}</span>}
    </Component>
  )
}

SidebarItem.displayName = 'SidebarItem'

// Sidebar Section Component
export interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
  collapsed?: boolean
  className?: string
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  collapsed = false,
  className,
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {title && !collapsed && (
        <h3
          className={cn(
            typography.caption1.className,
            'text-foreground/50 uppercase mb-2 px-3',
          )}
        >
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

SidebarSection.displayName = 'SidebarSection'
