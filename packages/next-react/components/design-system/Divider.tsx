'use client'

import React from 'react'

import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient' | 'double'
  size?: 'thin' | 'medium' | 'thick'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  
  label?: string
  labelPosition?: 'start' | 'center' | 'end'
  icon?: React.ReactNode
  
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  size = 'thin',
  spacing = 'md',
  label,
  labelPosition = 'center',
  icon,
  className,
}) => {
  const sizeClasses = {
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1',
  }
  
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
    xl: orientation === 'horizontal' ? 'my-8' : 'mx-8',
  }
  
  const variantStyles: Record<string, React.CSSProperties> = {
    solid: {},
    dashed: { borderStyle: 'dashed' },
    dotted: { borderStyle: 'dotted' },
    gradient: {
      background: 'linear-gradient(90deg, transparent, currentColor, transparent)',
    },
    double: { borderStyle: 'double', borderWidth: '3px' },
  }
  
  const labelPositionClasses = {
    start: orientation === 'horizontal' ? 'justify-start' : 'items-start',
    center: orientation === 'horizontal' ? 'justify-center' : 'items-center',
    end: orientation === 'horizontal' ? 'justify-end' : 'items-end',
  }
  
  if (label || icon) {
    return (
      <div
        className={cn(
          'flex items-center gap-4',
          orientation === 'vertical' && 'flex-col',
          spacingClasses[spacing],
          labelPositionClasses[labelPosition],
          className
        )}
      >
        <div
          className={cn(
            'flex-1',
            sizeClasses[size],
            variant === 'gradient' 
              ? 'bg-gradient-to-r from-transparent via-foreground/30 to-transparent'
              : 'bg-foreground/20',
            variant === 'dashed' && 'border-t border-dashed border-foreground/20 bg-transparent',
            variant === 'dotted' && 'border-t border-dotted border-foreground/20 bg-transparent',
            variant === 'double' && 'border-t-[3px] border-double border-foreground/20 bg-transparent'
          )}
          style={variant === 'gradient' ? variantStyles.gradient : {}}
        />
        {(label || icon) && (
          <div className={cn(
            'flex items-center gap-2 px-3',
            typography.caption1.className,
            'text-foreground/60'
          )}>
            {icon}
            {label}
          </div>
        )}
        <div
          className={cn(
            'flex-1',
            sizeClasses[size],
            variant === 'gradient' 
              ? 'bg-gradient-to-r from-transparent via-foreground/30 to-transparent'
              : 'bg-foreground/20',
            variant === 'dashed' && 'border-t border-dashed border-foreground/20 bg-transparent',
            variant === 'dotted' && 'border-t border-dotted border-foreground/20 bg-transparent',
            variant === 'double' && 'border-t-[3px] border-double border-foreground/20 bg-transparent'
          )}
          style={variant === 'gradient' ? variantStyles.gradient : {}}
        />
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'w-full' : 'h-full',
        sizeClasses[size],
        spacingClasses[spacing],
        variant === 'gradient' 
          ? 'bg-gradient-to-r from-transparent via-foreground/30 to-transparent'
          : 'bg-foreground/20',
        variant === 'dashed' && cn(
          orientation === 'horizontal' ? 'border-t' : 'border-l',
          'border-dashed border-foreground/20 bg-transparent'
        ),
        variant === 'dotted' && cn(
          orientation === 'horizontal' ? 'border-t' : 'border-l',
          'border-dotted border-foreground/20 bg-transparent'
        ),
        variant === 'double' && cn(
          orientation === 'horizontal' ? 'border-t-[3px]' : 'border-l-[3px]',
          'border-double border-foreground/20 bg-transparent'
        ),
        className
      )}
      style={variant === 'gradient' ? variantStyles.gradient : {}}
    />
  )
}