'use client'

import React, { useState, useRef, useMemo, useCallback } from 'react'

import { themes } from '@/lib/design-system/themes'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabViewProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void

  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline' | 'enclosed' | 'segments'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  animated?: boolean

  theme?: keyof typeof themes
  className?: string
  tabsClassName?: string
  contentClassName?: string
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  animated = true,
  theme = 'glass-aurora',
  className,
  tabsClassName,
  contentClassName,
}) => {
  const selectedTheme = themes[theme]
  // Internal state only used when uncontrolled
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id)
  // Track active tab element for indicator positioning
  const [activeTabElement, setActiveTabElement] = useState<HTMLButtonElement | null>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Controlled/uncontrolled pattern: use controlled value when provided
  const activeTab = controlledActiveTab ?? internalActiveTab

  // Compute indicator style during render using useMemo
  const indicatorStyle = useMemo<React.CSSProperties>(() => {
    if (variant !== 'underline' || !animated || !activeTabElement) {
      return {}
    }
    const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeTabElement
    return orientation === 'horizontal'
      ? { left: offsetLeft, width: offsetWidth }
      : { top: offsetTop, height: offsetHeight }
  }, [activeTabElement, variant, animated, orientation])

  // Ref callback to track active tab element
  const createTabRef = useCallback((tabId: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(tabId, el)
      // Update active tab element when this is the active tab
      if (tabId === activeTab) {
        setActiveTabElement(el)
      }
    }
  }, [activeTab])

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab?.disabled) return

    // Update internal state (for uncontrolled mode)
    setInternalActiveTab(tabId)
    // Update active tab element for indicator
    const el = tabRefs.current.get(tabId)
    if (el) setActiveTabElement(el)
    onTabChange?.(tabId)
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  }
  
  const variantClasses = {
    default: {
      tabs: 'bg-foreground/5 p-1 rounded-lg',
      tab: 'rounded-md',
      activeTab: 'bg-background shadow-sm',
    },
    pills: {
      tabs: 'gap-2',
      tab: 'rounded-full',
      activeTab: 'bg-primary text-white',
    },
    underline: {
      tabs: 'border-b border-border',
      tab: 'border-b-2 border-transparent -mb-px',
      activeTab: 'border-primary text-primary',
    },
    enclosed: {
      tabs: 'border-b border-border',
      tab: 'border border-transparent rounded-t-lg -mb-px',
      activeTab: 'border-border border-b-background bg-background',
    },
    segments: {
      tabs: cn('bg-foreground/5 p-1 rounded-lg', selectedTheme?.card),
      tab: 'rounded-md',
      activeTab: cn('bg-white/10 backdrop-blur-md', selectedTheme?.blur),
    },
  }
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content
  
  return (
    <div className={cn(
      'w-full',
      orientation === 'vertical' && 'flex gap-4',
      className
    )}>
      {/* Tab buttons */}
      <div
        className={cn(
          'relative flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          fullWidth && 'w-full',
          variantClasses[variant].tabs,
          tabsClassName
        )}
      >
        {/* Animated indicator for underline variant */}
        {variant === 'underline' && animated && (
          <div
            className={cn(
              'absolute bg-primary transition-all duration-200',
              orientation === 'horizontal' ? 'bottom-0 h-0.5' : 'right-0 w-0.5'
            )}
            style={indicatorStyle}
          />
        )}
        
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          
          return (
            <button
              key={tab.id}
              ref={createTabRef(tab.id)}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'flex items-center gap-2 font-medium transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                fullWidth && 'flex-1',
                sizeClasses[size],
                variantClasses[variant].tab,
                isActive && variantClasses[variant].activeTab,
                !isActive && 'hover:bg-foreground/5'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className={cn(
                  'px-1.5 py-0.5 text-xs rounded-full',
                  'bg-primary/20 text-primary'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Tab content */}
      <div className={cn(
        'flex-1',
        variant === 'enclosed' && 'border border-t-0 border-border rounded-b-lg p-4',
        animated && 'transition-opacity duration-200',
        contentClassName
      )}>
        {animated ? (
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {activeTabContent}
          </div>
        ) : (
          activeTabContent
        )}
      </div>
    </div>
  )
}