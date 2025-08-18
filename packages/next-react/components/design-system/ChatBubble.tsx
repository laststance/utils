'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react'

export interface ChatBubbleProps {
  message: string
  sender?: 'user' | 'other' | 'system'
  avatar?: string
  name?: string
  timestamp?: Date | string
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  reactions?: Array<{ emoji: string; count: number; active?: boolean }>
  isTyping?: boolean
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal'
  className?: string
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender = 'other',
  avatar,
  name,
  timestamp,
  status,
  reactions,
  isTyping,
  theme = 'glass-aurora',
  variant = 'default',
  className,
}) => {
  const selectedTheme = themes[theme]
  
  const formatTime = (time: Date | string) => {
    const date = typeof time === 'string' ? new Date(time) : time
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }
  
  const senderClasses = {
    user: 'ml-auto bg-primary text-white',
    other: 'mr-auto bg-foreground/10',
    system: 'mx-auto bg-transparent text-center text-foreground/60',
  }
  
  const variantClasses = {
    default: '',
    glass: cn(selectedTheme?.card, selectedTheme?.blur),
    minimal: 'bg-transparent border border-border',
  }
  
  const StatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock size={14} className="text-foreground/50" />
      case 'sent':
        return <Check size={14} className="text-foreground/50" />
      case 'delivered':
        return <CheckCheck size={14} className="text-foreground/50" />
      case 'read':
        return <CheckCheck size={14} className="text-primary" />
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />
      default:
        return null
    }
  }
  
  if (sender === 'system') {
    return (
      <div className={cn('text-center py-2', className)}>
        <span className={cn(
          typography.caption2.className,
          'px-3 py-1 rounded-full',
          'bg-foreground/5 text-foreground/60'
        )}>
          {message}
        </span>
      </div>
    )
  }
  
  return (
    <div className={cn(
      'flex gap-2 max-w-[70%]',
      sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
      className
    )}>
      {/* Avatar */}
      {avatar && sender !== 'user' && (
        <img
          src={avatar}
          alt={name || 'User'}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      
      <div className="flex flex-col gap-1">
        {/* Name */}
        {name && sender !== 'user' && (
          <span className={cn(typography.caption2.className, 'text-foreground/60 px-1')}>
            {name}
          </span>
        )}
        
        {/* Message bubble */}
        <div className={cn(
          'relative px-4 py-2 rounded-2xl',
          sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm',
          senderClasses[sender],
          variantClasses[variant]
        )}>
          {isTyping ? (
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <p className={cn(typography.body.className)}>
              {message}
            </p>
          )}
        </div>
        
        {/* Timestamp and status */}
        <div className={cn(
          'flex items-center gap-1 px-1',
          sender === 'user' ? 'justify-end' : 'justify-start'
        )}>
          {timestamp && (
            <span className={cn(typography.caption2.className, 'text-foreground/40')}>
              {formatTime(timestamp)}
            </span>
          )}
          {status && sender === 'user' && <StatusIcon />}
        </div>
        
        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 flex-wrap px-1">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  'bg-foreground/5 hover:bg-foreground/10',
                  'transition-colors',
                  reaction.active && 'bg-primary/20'
                )}
              >
                <span>{reaction.emoji}</span>
                {reaction.count > 1 && (
                  <span className="ml-1 text-foreground/60">{reaction.count}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}