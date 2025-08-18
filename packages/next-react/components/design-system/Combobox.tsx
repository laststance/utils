'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { shadows, radius } from '@/lib/design-system/spacing'
import { 
  ChevronDown,
  X,
  Check,
  Search,
  Plus,
  Loader2
} from 'lucide-react'
import { Badge } from './Feedback'

export interface ComboboxOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  category?: string
  disabled?: boolean
  meta?: any
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  
  // Multi-select
  multiple?: boolean
  maxSelections?: number
  
  // Search
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  customFilter?: (option: ComboboxOption, query: string) => boolean
  
  // Creation
  creatable?: boolean
  onCreate?: (value: string) => void
  createLabel?: (value: string) => string
  
  // Loading
  loading?: boolean
  loadingText?: string
  
  // Grouping
  groupBy?: keyof ComboboxOption | ((option: ComboboxOption) => string)
  
  // Appearance
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  clearable?: boolean
  
  // Custom rendering
  renderOption?: (option: ComboboxOption, selected: boolean) => React.ReactNode
  renderValue?: (value: string | string[]) => React.ReactNode
  renderTags?: (values: string[]) => React.ReactNode
  
  // Styling
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal' | 'bold'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
  dropdownClassName?: string
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  maxSelections,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  customFilter,
  creatable = false,
  onCreate,
  createLabel = (value) => `Create "${value}"`,
  loading = false,
  loadingText = 'Loading...',
  groupBy,
  placeholder = 'Select...',
  label,
  hint,
  error,
  disabled = false,
  clearable = true,
  renderOption,
  renderValue,
  renderTags,
  theme = 'glass-aurora',
  variant = 'glass',
  size = 'md',
  fullWidth = false,
  className,
  dropdownClassName,
}) => {
  const selectedTheme = themes[theme]
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      minHeight: 'min-h-[32px]',
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-base',
      minHeight: 'min-h-[40px]',
    },
    lg: {
      padding: 'px-5 py-3',
      text: 'text-lg',
      minHeight: 'min-h-[48px]',
    },
  }
  
  const variantClasses = {
    default: cn(
      'bg-background border border-border',
      'hover:border-foreground/30',
      'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'
    ),
    glass: cn(
      selectedTheme?.card,
      selectedTheme?.blur,
      'border border-white/10',
      'hover:border-white/20',
      'focus-within:border-white/30'
    ),
    minimal: cn(
      'bg-transparent border-b border-border',
      'hover:border-foreground/30',
      'focus-within:border-primary'
    ),
    bold: cn(
      'bg-background border-2 border-border',
      'hover:border-foreground/30',
      'focus-within:border-primary'
    ),
  }
  
  // Normalize value to array for internal use
  const selectedValues = useMemo(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])
  
  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options
    
    if (customFilter) {
      return options.filter(option => customFilter(option, searchQuery))
    }
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery, customFilter])
  
  // Group options if groupBy is provided
  const groupedOptions = useMemo(() => {
    if (!groupBy) return { '': filteredOptions }
    
    const groups: Record<string, ComboboxOption[]> = {}
    
    filteredOptions.forEach(option => {
      const groupKey = typeof groupBy === 'function' 
        ? groupBy(option) 
        : option[groupBy] as string || 'Other'
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(option)
    })
    
    return groups
  }, [filteredOptions, groupBy])
  
  // Check if we should show create option
  const showCreateOption = creatable && searchQuery && 
    !filteredOptions.some(opt => opt.label.toLowerCase() === searchQuery.toLowerCase())
  
  // Handle selection
  const handleSelect = (option: ComboboxOption) => {
    if (option.disabled) return
    
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value]
      
      if (maxSelections && newValues.length > maxSelections) {
        return
      }
      
      onChange?.(newValues)
    } else {
      onChange?.(option.value)
      setIsOpen(false)
    }
    
    setSearchQuery('')
  }
  
  // Handle create
  const handleCreate = () => {
    if (searchQuery) {
      onCreate?.(searchQuery)
      
      if (multiple) {
        onChange?.([...selectedValues, searchQuery])
      } else {
        onChange?.(searchQuery)
      }
      
      setSearchQuery('')
      setIsOpen(false)
    }
  }
  
  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(multiple ? [] : '')
  }
  
  // Handle remove tag
  const handleRemoveTag = (valueToRemove: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (multiple) {
      onChange?.(selectedValues.filter(v => v !== valueToRemove))
    }
  }
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setIsOpen(true)
      return
    }
    
    if (!isOpen) return
    
    const totalOptions = Object.values(groupedOptions).flat().length + (showCreateOption ? 1 : 0)
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev + 1) % totalOptions)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev - 1 + totalOptions) % totalOptions)
        break
      case 'Enter':
        e.preventDefault()
        if (showCreateOption && highlightedIndex === totalOptions - 1) {
          handleCreate()
        } else {
          const allOptions = Object.values(groupedOptions).flat()
          const option = allOptions[highlightedIndex]
          if (option) handleSelect(option)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Get display value
  const getDisplayValue = () => {
    if (renderValue) {
      return renderValue(multiple ? selectedValues : selectedValues[0] || '')
    }
    
    if (multiple && renderTags) {
      return renderTags(selectedValues)
    }
    
    if (multiple) {
      if (selectedValues.length === 0) return null
      
      return (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map(val => {
            const option = options.find(opt => opt.value === val)
            return (
              <Badge
                key={val}
                size="sm"
                removable
                onRemove={() => handleRemoveTag(val)}
              >
                {option?.label || val}
              </Badge>
            )
          })}
        </div>
      )
    }
    
    const selectedOption = options.find(opt => opt.value === selectedValues[0])
    return selectedOption?.label
  }
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative',
        fullWidth ? 'w-full' : 'w-64',
        className
      )}
    >
      {/* Label */}
      {label && (
        <label className={cn(
          typography.caption1.className,
          'block mb-1.5 font-medium text-foreground/70'
        )}>
          {label}
        </label>
      )}
      
      {/* Main trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'relative cursor-pointer',
          'flex items-center justify-between',
          radius.lg,
          variantClasses[variant],
          sizeConfig[size].padding,
          sizeConfig[size].text,
          sizeConfig[size].minHeight,
          'transition-all duration-200',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500'
        )}
      >
        {/* Value or placeholder */}
        <div className="flex-1 pr-2">
          {getDisplayValue() || (
            <span className="text-foreground/40">{placeholder}</span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          {clearable && selectedValues.length > 0 && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-foreground/10 rounded transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={cn(
              'transition-transform text-foreground/50',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>
      
      {/* Hint or error */}
      {(hint || error) && (
        <p className={cn(
          typography.caption2.className,
          'mt-1.5',
          error ? 'text-red-500' : 'text-foreground/50'
        )}>
          {error || hint}
        </p>
      )}
      
      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute top-full left-0 right-0 mt-1',
            'bg-background border border-border rounded-lg',
            shadows.lg,
            'z-50 max-h-80 overflow-auto',
            dropdownClassName
          )}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    onSearch?.(e.target.value)
                  }}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'w-full pl-9 pr-3 py-2',
                    'bg-foreground/5 rounded-md',
                    'outline-none focus:bg-foreground/10',
                    'text-sm'
                  )}
                  autoFocus
                />
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-foreground/50">{loadingText}</p>
            </div>
          ) : (
            <>
              {/* Options */}
              {Object.entries(groupedOptions).map(([group, groupOptions], groupIndex) => (
                <div key={group}>
                  {group && (
                    <div className="px-3 py-2 text-xs font-semibold text-foreground/50 uppercase">
                      {group}
                    </div>
                  )}
                  {groupOptions.map((option, optionIndex) => {
                    const isSelected = selectedValues.includes(option.value)
                    const globalIndex = Object.values(groupedOptions)
                      .slice(0, groupIndex)
                      .flat()
                      .length + optionIndex
                    const isHighlighted = highlightedIndex === globalIndex
                    
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={cn(
                          'px-3 py-2 cursor-pointer',
                          'hover:bg-foreground/5 transition-colors',
                          isHighlighted && 'bg-foreground/10',
                          isSelected && 'bg-primary/10',
                          option.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <div className="flex items-center gap-3">
                            {option.icon && (
                              <div className="flex-shrink-0">
                                {option.icon}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-xs text-foreground/50">
                                  {option.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <Check size={16} className="flex-shrink-0 text-primary" />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
              
              {/* Create option */}
              {showCreateOption && (
                <div
                  onClick={handleCreate}
                  className={cn(
                    'px-3 py-2 cursor-pointer border-t border-border',
                    'hover:bg-foreground/5 transition-colors',
                    'flex items-center gap-2'
                  )}
                >
                  <Plus size={16} />
                  <span className="text-sm">{createLabel(searchQuery)}</span>
                </div>
              )}
              
              {/* No results */}
              {filteredOptions.length === 0 && !showCreateOption && (
                <div className="p-8 text-center text-sm text-foreground/50">
                  No results found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}