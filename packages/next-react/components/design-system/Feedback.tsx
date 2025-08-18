'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { shadows, radius } from '@/lib/design-system/spacing'
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Loader2
} from 'lucide-react'

// Alert Component
export interface AlertProps {
  children?: React.ReactNode
  title?: string
  description?: string
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
  theme?: keyof typeof themes
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  children,
  title,
  description,
  variant = 'default',
  theme = 'glass-clear',
  dismissible = false,
  onDismiss,
  icon,
  action,
  className,
}) => {
  const selectedTheme = themes[theme]
  
  const variantConfig = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: icon || <Info size={20} />,
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-600 dark:text-green-400',
      icon: icon || <CheckCircle size={20} />,
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      icon: icon || <AlertTriangle size={20} />,
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-600 dark:text-red-400',
      icon: icon || <AlertCircle size={20} />,
    },
    default: {
      bg: selectedTheme?.card || 'bg-foreground/5',
      border: 'border-border',
      text: 'text-foreground',
      icon: icon || <Info size={20} />,
    },
  }
  
  const config = variantConfig[variant]
  
  return (
    <div
      role="alert"
      className={cn(
        'relative p-4 border',
        radius.lg,
        config.bg,
        config.border,
        selectedTheme?.blur,
        className
      )}
    >
      <div className="flex gap-3">
        {config.icon && (
          <div className={cn('flex-shrink-0 mt-0.5', config.text)}>
            {config.icon}
          </div>
        )}
        
        <div className="flex-1 space-y-1">
          {title && (
            <h3 className={cn(
              typography.subheadline.className,
              'font-semibold',
              config.text
            )}>
              {title}
            </h3>
          )}
          
          {description && (
            <p className={cn(
              typography.caption1.className,
              'text-foreground/70'
            )}>
              {description}
            </p>
          )}
          
          {children}
          
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-lg',
              'hover:bg-foreground/10 transition-colors',
              config.text
            )}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

// Toast Component
export interface ToastProps {
  id?: string
  title?: string
  description?: string
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
  duration?: number // in milliseconds
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'default',
  duration = 5000,
  action,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])
  
  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }
  
  if (!isVisible) return null
  
  const variantConfig = {
    info: {
      bg: 'bg-blue-500',
      icon: <Info size={20} />,
    },
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircle size={20} />,
    },
    warning: {
      bg: 'bg-amber-500',
      icon: <AlertTriangle size={20} />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <AlertCircle size={20} />,
    },
    default: {
      bg: 'bg-foreground',
      icon: <Info size={20} />,
    },
  }
  
  const config = variantConfig[variant]
  
  return (
    <div
      className={cn(
        'min-w-[300px] max-w-md',
        'bg-background border border-border',
        'rounded-xl shadow-2xl',
        'transform transition-all duration-300',
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      <div className={cn('h-1 rounded-t-xl', config.bg)} />
      
      <div className="p-4">
        <div className="flex gap-3">
          <div className={cn('flex-shrink-0', config.bg, 'text-white rounded-lg p-2')}>
            {config.icon}
          </div>
          
          <div className="flex-1">
            {title && (
              <h4 className={cn(typography.subheadline.className, 'font-semibold mb-1')}>
                {title}
              </h4>
            )}
            {description && (
              <p className={cn(typography.caption1.className, 'text-foreground/70')}>
                {description}
              </p>
            )}
            
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  'mt-2 text-sm font-medium text-primary hover:underline'
                )}
              >
                {action.label}
              </button>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-foreground/10 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal Component
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  theme?: keyof typeof themes
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  theme = 'glass-aurora',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const selectedTheme = themes[theme]
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative w-full',
          sizeClasses[size],
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        <div className={cn(
          'bg-background',
          'border border-border',
          'rounded-2xl',
          shadows.modal,
          selectedTheme?.card,
          selectedTheme?.blur
        )}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                {title && (
                  <h2 className={cn(typography.title3.className, 'mb-1')}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className={cn(typography.body.className, 'text-foreground/70')}>
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-foreground/10 transition-colors -mr-2 -mt-1"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          {children && (
            <div className="p-6">
              {children}
            </div>
          )}
          
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Progress Bar Component
export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  variant?: 'default' | 'gradient' | 'striped'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'md',
  animated = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const variantClasses = {
    default: 'bg-primary',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    striped: cn(
      'bg-primary',
      'bg-gradient-to-r from-transparent via-white/20 to-transparent',
      'bg-[length:20px_100%]',
      animated && 'animate-[shimmer_1s_linear_infinite]'
    ),
  }
  
  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={cn(typography.caption1.className, 'text-foreground/70')}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={cn(typography.caption1.className, 'text-foreground/70')}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-foreground/10 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

// Loading Spinner Component
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'white'
  label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }
  
  const variantClasses = {
    default: 'text-foreground/30',
    primary: 'text-primary',
    white: 'text-white',
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          'animate-spin'
        )}
      />
      {label && (
        <span className={cn(typography.caption1.className, 'text-foreground/60')}>
          {label}
        </span>
      )}
    </div>
  )
}

// Skeleton Loader Component
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  className?: string
  animated?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  animated = true,
}) => {
  const variantClasses = {
    text: cn('h-4 rounded'),
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }
  
  const dimensions = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : 
            variant === 'circular' ? width : variant === 'text' ? '1rem' : '100px',
  }
  
  return (
    <div
      className={cn(
        'bg-foreground/10',
        variantClasses[variant],
        animated && 'animate-pulse',
        className
      )}
      style={dimensions}
    />
  )
}

// Badge Component
export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className,
}) => {
  const variantClasses = {
    default: 'bg-foreground/10 text-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'default' ? 'bg-foreground' :
          variant === 'primary' ? 'bg-primary' :
          variant === 'success' ? 'bg-green-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        )} />
      )}
      
      {children}
      
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}

// Tooltip Component
export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  
  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }
  
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1',
            'bg-gray-900 text-white text-xs rounded-md',
            'whitespace-nowrap',
            'animate-in fade-in zoom-in-95 duration-100',
            positionClasses[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}