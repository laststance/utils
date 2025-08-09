'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { containers, padding } from '@/lib/design-system/spacing'

export interface ContainerProps {
  children: React.ReactNode
  className?: string
  theme?: keyof typeof themes
  maxWidth?: keyof typeof containers
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  glass?: boolean
  centered?: boolean
  fullHeight?: boolean
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  theme = 'glass-clear',
  maxWidth = '7xl',
  padding: paddingSize = 'md',
  glass = true,
  centered = true,
  fullHeight = false,
}) => {
  const selectedTheme = themes[theme]
  const paddingClass = paddingSize === 'none' ? '' : padding.container[paddingSize as keyof typeof padding.container]
  
  return (
    <div
      className={cn(
        'w-full',
        fullHeight && 'min-h-screen',
        centered && 'mx-auto',
        containers[maxWidth],
        paddingClass,
        glass && [
          selectedTheme?.card,
          selectedTheme?.blur,
          selectedTheme?.border,
          selectedTheme?.shadow,
        ],
        className
      )}
    >
      {children}
    </div>
  )
}

Container.displayName = 'Container'