'use client'

import React from 'react'

import { shadows, radius } from '@/lib/design-system/spacing'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

export interface HeaderProps {
  children?: React.ReactNode
  className?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'minimal' | 'bold' | 'floating'
  sticky?: boolean
  transparent?: boolean
  blur?: boolean
  logo?: React.ReactNode
  navigation?: React.ReactNode
  actions?: React.ReactNode
  height?: 'sm' | 'md' | 'lg'
}

const heightClasses = {
  sm: 'h-14',
  md: 'h-16',
  lg: 'h-20',
}

export const Header: React.FC<HeaderProps> = ({
  children,
  className,
  theme = 'glass-clear',
  variant = 'default',
  sticky = true,
  transparent = false,
  blur = true,
  logo,
  navigation,
  actions,
  height = 'md',
}) => {
  const selectedTheme = themes[theme]
  
  const variantClasses = {
    default: cn(
      selectedTheme?.card,
      selectedTheme?.border,
      'border-b',
      shadows.card
    ),
    minimal: cn(
      transparent ? 'bg-transparent' : 'bg-background/80',
      blur && 'backdrop-blur-md',
      'border-b border-border/50'
    ),
    bold: cn(
      selectedTheme?.background,
      selectedTheme?.border,
      'border-b-2',
      shadows.lg
    ),
    floating: cn(
      selectedTheme?.card,
      selectedTheme?.border,
      radius.xl,
      shadows['glass-elevated'],
      'mx-4 mt-4'
    ),
  }
  
  return (
    <header
      className={cn(
        'w-full',
        heightClasses[height],
        sticky && 'sticky top-0 z-50',
        blur && selectedTheme?.blur,
        variantClasses[variant],
        'transition-all duration-300',
        className
      )}
    >
      <div className="h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Section */}
        {logo && (
          <div className="flex-shrink-0">
            {logo}
          </div>
        )}
        
        {/* Navigation Section */}
        {navigation && (
          <nav className="hidden md:flex items-center space-x-8 flex-1 ml-8">
            {navigation}
          </nav>
        )}
        
        {/* Actions Section */}
        {actions && (
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        )}
        
        {/* Custom Children */}
        {!logo && !navigation && !actions && children}
      </div>
    </header>
  )
}

Header.displayName = 'Header'

// Navigation Item Component
export interface NavItemProps {
  href?: string
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const NavItem: React.FC<NavItemProps> = ({
  href = '#',
  active = false,
  children,
  onClick,
  className,
}) => {
  const Component = href ? 'a' : 'button'
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        typography.subheadline.className,
        'px-3 py-2 rounded-lg transition-all duration-200',
        active
          ? 'text-primary font-semibold bg-primary/10'
          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5',
        className
      )}
    >
      {children}
    </Component>
  )
}

NavItem.displayName = 'NavItem'