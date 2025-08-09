'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { padding, shadows, radius } from '@/lib/design-system/spacing'

export interface FooterProps {
  children?: React.ReactNode
  className?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'minimal' | 'bold' | 'floating'
  sticky?: boolean
  transparent?: boolean
  blur?: boolean
  logo?: React.ReactNode
  navigation?: React.ReactNode
  social?: React.ReactNode
  legal?: React.ReactNode
  copyright?: string
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
}

const heightClasses = {
  sm: 'min-h-[100px]',
  md: 'min-h-[150px]',
  lg: 'min-h-[200px]',
  xl: 'min-h-[250px]',
  auto: 'min-h-0',
}

export const Footer: React.FC<FooterProps> = ({
  children,
  className,
  theme = 'glass-clear',
  variant = 'default',
  sticky = false,
  transparent = false,
  blur = true,
  logo,
  navigation,
  social,
  legal,
  copyright,
  height = 'auto',
}) => {
  const selectedTheme = themes[theme]
  const currentYear = new Date().getFullYear()
  
  const variantClasses = {
    default: cn(
      selectedTheme?.card,
      selectedTheme?.border,
      'border-t',
      shadows.card
    ),
    minimal: cn(
      transparent ? 'bg-transparent' : 'bg-background/80',
      blur && 'backdrop-blur-md',
      'border-t border-border/50'
    ),
    bold: cn(
      selectedTheme?.background,
      selectedTheme?.border,
      'border-t-2',
      shadows.lg
    ),
    floating: cn(
      selectedTheme?.card,
      selectedTheme?.border,
      radius.xl,
      shadows['glass-elevated'],
      'mx-4 mb-4'
    ),
  }
  
  return (
    <footer
      className={cn(
        'w-full',
        heightClasses[height],
        sticky && 'sticky bottom-0 z-40',
        blur && selectedTheme?.blur,
        variantClasses[variant],
        'transition-all duration-300',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Custom Content */}
        {!logo && !navigation && !social && !legal && !copyright && children}
        
        {/* Structured Footer */}
        {(logo || navigation || social || legal || copyright) && (
          <div className={cn('py-8 md:py-12 lg:py-16', padding.section.sm)}>
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Logo/Brand Section */}
              {logo && (
                <div className="lg:col-span-1">
                  <div className="mb-4">{logo}</div>
                  <p className={cn(
                    typography.footnote.className,
                    'text-foreground/60 max-w-xs'
                  )}>
                    Crafted with precision and attention to detail.
                  </p>
                </div>
              )}
              
              {/* Navigation Links */}
              {navigation && (
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {navigation}
                  </div>
                </div>
              )}
              
              {/* Social Links */}
              {social && (
                <div className="lg:col-span-1">
                  <h4 className={cn(
                    typography.caption1.className,
                    'text-foreground/50 uppercase mb-4'
                  )}>
                    Connect
                  </h4>
                  <div className="flex gap-4">
                    {social}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Bar */}
            {(legal || copyright) && (
              <div className={cn(
                'pt-8 border-t',
                selectedTheme?.border,
                'flex flex-col md:flex-row justify-between items-center gap-4'
              )}>
                {/* Legal Links */}
                {legal && (
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {legal}
                  </div>
                )}
                
                {/* Copyright */}
                {copyright && (
                  <p className={cn(
                    typography.caption1.className,
                    'text-foreground/50'
                  )}>
                    © {currentYear} {copyright}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'

// Footer Link Component
export interface FooterLinkProps {
  href?: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'legal'
}

export const FooterLink: React.FC<FooterLinkProps> = ({
  href = '#',
  children,
  onClick,
  className,
  variant = 'default',
}) => {
  const Component = href ? 'a' : 'button'
  
  const variantClasses = {
    default: cn(
      typography.subheadline.className,
      'text-foreground/70 hover:text-foreground transition-colors duration-200'
    ),
    legal: cn(
      typography.caption1.className,
      'text-foreground/50 hover:text-foreground/70 transition-colors duration-200'
    ),
  }
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Component>
  )
}

FooterLink.displayName = 'FooterLink'

// Footer Section Component
export interface FooterSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h4 className={cn(
        typography.caption1.className,
        'text-foreground/50 uppercase'
      )}>
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

FooterSection.displayName = 'FooterSection'

// Social Icon Component
export interface SocialIconProps {
  href?: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  href = '#',
  icon,
  label,
  onClick,
  className,
}) => {
  const Component = href ? 'a' : 'button'
  
  return (
    <Component
      href={href}
      onClick={onClick}
      aria-label={label}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center',
        'bg-foreground/5 hover:bg-foreground/10',
        'text-foreground/60 hover:text-foreground',
        'transition-all duration-200',
        'hover:scale-110',
        className
      )}
    >
      {icon}
    </Component>
  )
}

SocialIcon.displayName = 'SocialIcon'