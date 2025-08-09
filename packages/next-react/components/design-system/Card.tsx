'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { padding, shadows, radius } from '@/lib/design-system/spacing'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient' | 'interactive'
  theme?: keyof typeof themes
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glass' | 'elevated'
  hoverable?: boolean
  clickable?: boolean
  selected?: boolean
  disabled?: boolean
  glassIntensity?: 'light' | 'medium' | 'strong'
  asChild?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    theme = 'glass-clear',
    padding: paddingSize = 'md',
    rounded = 'lg',
    shadow = 'md',
    hoverable = false,
    clickable = false,
    selected = false,
    disabled = false,
    glassIntensity = 'medium',
    asChild = false,
    children,
    onClick,
    ...props
  }, ref) => {
    const selectedTheme = themes[theme]
    
    const paddingClasses = {
      none: '',
      sm: padding.card.sm,
      md: padding.card.md,
      lg: padding.card.lg,
      xl: padding.card.xl,
    }
    
    const roundedClasses = {
      none: radius.none,
      sm: radius.sm,
      md: radius.md,
      lg: radius.lg,
      xl: radius.xl,
      full: radius.full,
    }
    
    const shadowClasses = {
      none: shadows.none,
      sm: shadows.sm,
      md: shadows.md,
      lg: shadows.lg,
      xl: shadows.xl,
      glass: shadows.glass,
      elevated: shadows['glass-elevated'],
    }
    
    const glassIntensityClasses = {
      light: 'bg-opacity-30 backdrop-blur-sm',
      medium: 'bg-opacity-50 backdrop-blur-md',
      strong: 'bg-opacity-70 backdrop-blur-lg',
    }
    
    const variantClasses = {
      default: cn(
        'bg-card',
        'border border-border'
      ),
      glass: cn(
        selectedTheme?.card,
        selectedTheme?.blur,
        selectedTheme?.border,
        'border',
        glassIntensityClasses[glassIntensity]
      ),
      elevated: cn(
        'bg-card',
        'border border-border/50',
        shadows['glass-elevated']
      ),
      outlined: cn(
        'bg-transparent',
        'border-2 border-border'
      ),
      gradient: cn(
        'bg-gradient-to-br',
        theme.includes('aurora')
          ? 'from-purple-500/10 via-pink-500/10 to-indigo-500/10'
          : theme.includes('sunset')
          ? 'from-orange-400/10 via-pink-500/10 to-purple-600/10'
          : 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
        'border border-border/50',
        selectedTheme?.blur
      ),
      interactive: cn(
        selectedTheme?.card,
        selectedTheme?.blur,
        selectedTheme?.border,
        'border',
        'transition-all duration-300',
        'hover:shadow-xl hover:scale-[1.02]',
        'active:scale-[0.98]'
      ),
    }
    
    const Comp = asChild ? 'div' : 'article'
    
    return (
      <Comp
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden',
          'transition-all duration-200',
          
          // Variant
          variantClasses[variant],
          
          // Padding
          paddingClasses[paddingSize],
          
          // Rounded
          roundedClasses[rounded],
          
          // Shadow
          shadowClasses[shadow],
          
          // Interactive states
          hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
          clickable && 'cursor-pointer active:scale-[0.99]',
          selected && 'ring-2 ring-primary ring-offset-2',
          disabled && 'opacity-50 pointer-events-none',
          
          className
        )}
        onClick={clickable ? onClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-disabled={disabled}
        aria-selected={selected}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  separator?: boolean
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ 
    className,
    title,
    subtitle,
    icon,
    action,
    separator = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between',
          separator && 'pb-4 border-b border-border/50',
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          
          <div className="flex-1">
            {title && (
              <h3 className={cn(
                typography.headline.className,
                'text-foreground'
              )}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={cn(
                typography.subheadline.className,
                'text-foreground/60 mt-1'
              )}>
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
        
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Body Component
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  prose?: boolean
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, prose = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'py-4',
          prose && 'prose prose-sm max-w-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean
  align?: 'left' | 'center' | 'right' | 'between'
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, separator = false, align = 'right', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          alignClasses[align],
          separator && 'pt-4 border-t border-border/50',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// Card Image Component
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | '4/3' | '3/2' | '16/10' | '21/9'
  overlay?: boolean
  overlayGradient?: 'top' | 'bottom' | 'both'
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ 
    className,
    aspectRatio = 'video',
    overlay = false,
    overlayGradient = 'bottom',
    alt = '',
    ...props 
  }, ref) => {
    const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '3/2': 'aspect-[3/2]',
      '16/10': 'aspect-[16/10]',
      '21/9': 'aspect-[21/9]',
    }
    
    const gradientClasses = {
      top: 'bg-gradient-to-b from-black/50 to-transparent',
      bottom: 'bg-gradient-to-t from-black/50 to-transparent',
      both: 'bg-gradient-to-b from-black/30 via-transparent to-black/50',
    }
    
    return (
      <div className={cn('relative overflow-hidden -m-6 mb-0', aspectClasses[aspectRatio])}>
        <img
          ref={ref}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            className
          )}
          {...props}
        />
        {overlay && (
          <div className={cn(
            'absolute inset-0',
            gradientClasses[overlayGradient]
          )} />
        )}
      </div>
    )
  }
)

CardImage.displayName = 'CardImage'

// Card Grid Component
export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

export const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(
  ({ 
    className,
    columns = 3,
    gap = 'md',
    responsive = true,
    children,
    ...props 
  }, ref) => {
    const columnClasses = responsive
      ? {
          1: 'grid-cols-1',
          2: 'grid-cols-1 md:grid-cols-2',
          3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
          6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        }
      : {
          1: 'grid-cols-1',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4',
          5: 'grid-cols-5',
          6: 'grid-cols-6',
        }
    
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          columnClasses[columns],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardGrid.displayName = 'CardGrid'