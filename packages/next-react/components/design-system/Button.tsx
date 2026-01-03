'use client'

import { Loader2 } from 'lucide-react'
import React from 'react'

import { shadows, radius, touchTargets } from '@/lib/design-system/spacing'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'glass' | 'gradient' | 'destructive' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  theme?: keyof typeof themes
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  glow?: boolean
  haptic?: boolean
  rounded?: boolean
  asChild?: boolean
}

const sizeClasses = {
  xs: cn(
    'h-7 px-2.5 text-xs',
    typography.caption2.className
  ),
  sm: cn(
    'h-9 px-3',
    typography.footnote.className
  ),
  md: cn(
    'h-11 px-5',
    typography.subheadline.className,
    touchTargets.min
  ),
  lg: cn(
    'h-12 px-6',
    typography.callout.className,
    touchTargets.md
  ),
  xl: cn(
    'h-14 px-8',
    typography.body.className,
    touchTargets.lg
  ),
}

const Button = ({ ref, className, variant = 'default', size = 'md', theme = 'glass-clear', loading = false, fullWidth = false, icon, iconPosition = 'left', glow = false, haptic = false, rounded = false, disabled = false, asChild = false, children, onClick, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const selectedTheme = themes[theme]
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(10)
      }
      onClick?.(e)
    }
    
    const variantClasses = {
      default: cn(
        'bg-foreground/10 hover:bg-foreground/15',
        'text-foreground',
        'border border-foreground/10',
        'hover:border-foreground/20',
        'active:scale-[0.98]'
      ),
      primary: cn(
        selectedTheme?.primary || 'bg-primary',
        'text-primary-foreground',
        'hover:opacity-90',
        'active:scale-[0.98]',
        shadows.md,
        'hover:shadow-lg'
      ),
      secondary: cn(
        selectedTheme?.secondary || 'bg-secondary',
        'text-secondary-foreground',
        'hover:opacity-90',
        'active:scale-[0.98]'
      ),
      ghost: cn(
        'bg-transparent',
        'text-foreground',
        'hover:bg-foreground/5',
        'active:bg-foreground/10',
        'active:scale-[0.98]'
      ),
      glass: cn(
        selectedTheme?.card,
        selectedTheme?.blur,
        selectedTheme?.border,
        'border',
        'text-foreground',
        'hover:bg-foreground/5',
        'active:scale-[0.98]',
        shadows.glass
      ),
      gradient: cn(
        'bg-gradient-to-r',
        theme.includes('aurora') 
          ? 'from-purple-500 via-pink-500 to-indigo-500'
          : theme.includes('sunset')
          ? 'from-orange-400 via-pink-500 to-purple-600'
          : 'from-blue-500 via-indigo-500 to-purple-500',
        'text-white',
        'hover:opacity-90',
        'active:scale-[0.98]',
        shadows.lg,
        'hover:shadow-xl'
      ),
      destructive: cn(
        selectedTheme?.destructive || 'bg-destructive',
        'text-destructive-foreground',
        'hover:opacity-90',
        'active:scale-[0.98]'
      ),
      outline: cn(
        'bg-transparent',
        'border-2',
        selectedTheme?.border || 'border-border',
        'text-foreground',
        'hover:bg-foreground/5',
        'active:scale-[0.98]'
      ),
    }
    
    const glowEffects = {
      primary: shadows['blue-glow'],
      secondary: shadows['purple-glow'],
      destructive: shadows['pink-glow'],
      gradient: 'shadow-[0_0_40px_rgba(147,51,234,0.4)]',
    }
    
    const glowClasses = glow && glowEffects[variant as keyof typeof glowEffects]
    
    const Comp = asChild ? 'span' : 'button'
    
    return (
      <Comp
        ref={ref}
        type="button"
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-offset-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Size
          sizeClasses[size],
          
          // Variant
          variantClasses[variant],
          
          // Shape
          rounded ? radius.full : radius.button,
          
          // Width
          fullWidth && 'w-full',
          
          // Glow effect
          glowClasses,
          
          // Loading state
          loading && 'cursor-wait',
          
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {/* Left icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        {/* Content */}
        {children}
        
        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
      </Comp>
    )
  }

Button.displayName = 'Button'

export { Button }

// Button Group Component
export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  size = 'md',
}) => {
  const gapClasses = {
    sm: orientation === 'horizontal' ? 'gap-1' : 'gap-1',
    md: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
    lg: orientation === 'horizontal' ? 'gap-3' : 'gap-3',
  }
  
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        gapClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}

ButtonGroup.displayName = 'ButtonGroup'

// Icon Button Component
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'iconPosition'> {
  icon: React.ReactNode
  label: string
}

export const IconButton = ({ ref, icon, label, size = 'md', className, ...props }: IconButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const iconSizeClasses = {
      xs: 'h-7 w-7',
      sm: 'h-9 w-9',
      md: 'h-11 w-11',
      lg: 'h-12 w-12',
      xl: 'h-14 w-14',
    }

    return (
      <Button
        {...(ref ? { ref } : {})}
        size={size}
        className={cn(
          iconSizeClasses[size],
          'p-0',
          className
        )}
        aria-label={label}
        {...props}
      >
        {icon}
      </Button>
    )
  }

IconButton.displayName = 'IconButton'

// Floating Action Button Component
export interface FABProps extends ButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  offset?: 'sm' | 'md' | 'lg'
}

export const FAB = ({ ref, position = 'bottom-right', offset = 'md', className, ...props }: FABProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const positionClasses = {
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    }

    const offsetClasses = {
      sm: 'm-4',
      md: 'm-6',
      lg: 'm-8',
    }

    return (
      <Button
        {...(ref ? { ref } : {})}
        className={cn(
          'fixed z-50',
          positionClasses[position],
          offsetClasses[offset],
          'shadow-xl hover:shadow-2xl',
          className
        )}
        {...props}
      />
    )
  }

FAB.displayName = 'FAB'