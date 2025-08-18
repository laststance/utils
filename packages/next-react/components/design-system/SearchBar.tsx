'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { shadows, radius } from '@/lib/design-system/spacing'
import { 
  Search, 
  X, 
  Filter,
  Clock,
  TrendingUp,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Feedback'

export interface SearchSuggestion {
  id: string
  text: string
  type?: 'recent' | 'trending' | 'suggestion' | 'command'
  icon?: React.ReactNode
  category?: string
  meta?: string
  action?: () => void
}

export interface SearchFilter {
  id: string
  label: string
  type: 'select' | 'date' | 'range' | 'toggle'
  options?: { value: string; label: string }[]
  value?: any
  icon?: React.ReactNode
}

export interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string, filters?: Record<string, any>) => void
  onClear?: () => void
  
  // Autocomplete
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  trendingSearches?: string[]
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  showAutocomplete?: boolean
  autocompleteDelay?: number
  
  // Filters
  filters?: SearchFilter[]
  onFilterChange?: (filterId: string, value: any) => void
  filterPosition?: 'dropdown' | 'inline' | 'sidebar'
  
  // Features
  voice?: boolean
  onVoiceSearch?: () => void
  clearable?: boolean
  loading?: boolean
  autoFocus?: boolean
  
  // Appearance
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal' | 'bold'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: React.ReactNode
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  onSuggestionSelect,
  showAutocomplete = true,
  autocompleteDelay = 300,
  filters = [],
  onFilterChange,
  filterPosition = 'dropdown',
  voice = false,
  onVoiceSearch,
  clearable = true,
  loading = false,
  autoFocus = false,
  theme = 'glass-aurora',
  variant = 'glass',
  size = 'md',
  fullWidth = false,
  icon,
  className,
}) => {
  const selectedTheme = themes[theme]
  const [internalValue, setInternalValue] = useState('')
  const [, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const value = controlledValue !== undefined ? controlledValue : internalValue
  
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 16,
      height: 'h-8',
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 20,
      height: 'h-10',
    },
    lg: {
      padding: 'px-5 py-3',
      text: 'text-lg',
      icon: 24,
      height: 'h-12',
    },
  }
  
  const variantClasses = {
    default: cn(
      'bg-background border border-border',
      'focus-within:border-primary'
    ),
    glass: cn(
      selectedTheme?.card,
      selectedTheme?.blur,
      'border border-white/10',
      'focus-within:border-white/20'
    ),
    minimal: cn(
      'bg-transparent border-b border-border',
      'focus-within:border-primary'
    ),
    bold: cn(
      'bg-background border-2 border-border',
      'focus-within:border-primary'
    ),
  }
  
  // Combine all suggestions
  const allSuggestions = useMemo(() => {
    const combined: SearchSuggestion[] = []
    
    // Add recent searches
    if (recentSearches.length > 0) {
      combined.push(...recentSearches.slice(0, 3).map(text => ({
        id: `recent-${text}`,
        text,
        type: 'recent' as const,
        icon: <Clock size={16} />,
      })))
    }
    
    // Add trending searches
    if (trendingSearches.length > 0) {
      combined.push(...trendingSearches.slice(0, 3).map(text => ({
        id: `trending-${text}`,
        text,
        type: 'trending' as const,
        icon: <TrendingUp size={16} />,
      })))
    }
    
    // Add custom suggestions
    combined.push(...suggestions)
    
    // Filter by current value
    if (value) {
      return combined.filter(s => 
        s.text.toLowerCase().includes(value.toLowerCase())
      )
    }
    
    return combined
  }, [suggestions, recentSearches, trendingSearches, value])
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
    
    // Show suggestions after delay
    if (showAutocomplete) {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current)
      }
      autocompleteTimeoutRef.current = setTimeout(() => {
        setShowSuggestions(true)
      }, autocompleteDelay)
    }
  }
  
  // Handle search submit
  const handleSearch = () => {
    if (value.trim()) {
      onSearch?.(value, selectedFilters)
      setShowSuggestions(false)
    }
  }
  
  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.action) {
      suggestion.action()
    } else {
      setInternalValue(suggestion.text)
      onChange?.(suggestion.text)
      onSuggestionSelect?.(suggestion)
      onSearch?.(suggestion.text, selectedFilters)
    }
    setShowSuggestions(false)
    inputRef.current?.focus()
  }
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        handleSearch()
      }
      return
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < allSuggestions.length) {
          const suggestion = allSuggestions[highlightedIndex]
          if (suggestion) {
            handleSuggestionClick(suggestion)
          }
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        break
    }
  }
  
  // Handle clear
  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
    onClear?.()
    inputRef.current?.focus()
  }
  
  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...selectedFilters, [filterId]: value }
    setSelectedFilters(newFilters)
    onFilterChange?.(filterId, value)
  }
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setShowFilterDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Filter count
  const activeFilterCount = Object.values(selectedFilters).filter(v => v).length
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative',
        fullWidth ? 'w-full' : 'w-96',
        className
      )}
    >
      {/* Main search input */}
      <div className={cn(
        'relative flex items-center',
        radius.lg,
        variantClasses[variant],
        variant !== 'minimal' && shadows.sm,
        'transition-all duration-200'
      )}>
        {/* Search icon */}
        <div className={cn(
          'flex-shrink-0',
          variant === 'minimal' ? 'ml-0' : 'ml-3'
        )}>
          {loading ? (
            <Loader2 
              size={sizeConfig[size].icon} 
              className="animate-spin text-foreground/50"
            />
          ) : (
            icon || <Search size={sizeConfig[size].icon} className="text-foreground/50" />
          )}
        </div>
        
        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true)
            if (showAutocomplete && allSuggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'flex-1 bg-transparent outline-none',
            sizeConfig[size].padding,
            sizeConfig[size].text,
            'placeholder:text-foreground/40'
          )}
        />
        
        {/* Right side actions */}
        <div className="flex items-center gap-2 mr-3">
          {/* Filter button */}
          {filters.length > 0 && filterPosition === 'dropdown' && (
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={cn(
                'p-1.5 rounded-md',
                'hover:bg-foreground/10 transition-colors',
                activeFilterCount > 0 && 'text-primary'
              )}
            >
              <Filter size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
          
          {/* Voice search */}
          {voice && onVoiceSearch && (
            <button
              onClick={onVoiceSearch}
              className="p-1.5 rounded-md hover:bg-foreground/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
          
          {/* Clear button */}
          {clearable && value && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-md hover:bg-foreground/10 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          
          {/* Search button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="px-3"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      
      {/* Inline filters */}
      {filters.length > 0 && filterPosition === 'inline' && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.map(filter => (
            <Badge
              key={filter.id}
              variant={selectedFilters[filter.id] ? 'primary' : 'default'}
              removable={!!selectedFilters[filter.id]}
              onRemove={() => handleFilterChange(filter.id, null)}
            >
              {filter.icon}
              {filter.label}
              {selectedFilters[filter.id] && `: ${selectedFilters[filter.id]}`}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Filter dropdown */}
      {showFilterDropdown && filterPosition === 'dropdown' && (
        <div className={cn(
          'absolute top-full left-0 right-0 mt-2 p-4',
          'bg-background border border-border rounded-lg',
          shadows.lg,
          'z-50'
        )}>
          <h4 className="text-sm font-semibold mb-3">Filters</h4>
          <div className="space-y-3">
            {filters.map(filter => (
              <div key={filter.id}>
                <label className="text-sm text-foreground/70 mb-1 block">
                  {filter.label}
                </label>
                {filter.type === 'select' && (
                  <select
                    value={selectedFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-1.5 bg-foreground/5 border border-border rounded-md text-sm"
                  >
                    <option value="">All</option>
                    {filter.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === 'toggle' && (
                  <button
                    onClick={() => handleFilterChange(filter.id, !selectedFilters[filter.id])}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm',
                      selectedFilters[filter.id] 
                        ? 'bg-primary text-white' 
                        : 'bg-foreground/5 hover:bg-foreground/10'
                    )}
                  >
                    {selectedFilters[filter.id] ? 'Enabled' : 'Disabled'}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFilters({})
                filters.forEach(f => onFilterChange?.(f.id, null))
              }}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFilterDropdown(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
      
      {/* Autocomplete suggestions */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div className={cn(
          'absolute top-full left-0 right-0 mt-2',
          'bg-background border border-border rounded-lg',
          shadows.lg,
          'z-50 max-h-96 overflow-auto'
        )}>
          {/* Group suggestions by category */}
          {allSuggestions.some(s => s.type === 'recent') && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-foreground/50">
                Recent Searches
              </div>
              {allSuggestions
                .filter(s => s.type === 'recent')
                .map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    highlighted={highlightedIndex === allSuggestions.indexOf(suggestion)}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
            </div>
          )}
          
          {allSuggestions.some(s => s.type === 'trending') && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-foreground/50">
                Trending
              </div>
              {allSuggestions
                .filter(s => s.type === 'trending')
                .map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    highlighted={highlightedIndex === allSuggestions.indexOf(suggestion)}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
            </div>
          )}
          
          {allSuggestions.some(s => s.type === 'suggestion' || !s.type) && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-foreground/50">
                Suggestions
              </div>
              {allSuggestions
                .filter(s => s.type === 'suggestion' || !s.type)
                .map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    highlighted={highlightedIndex === allSuggestions.indexOf(suggestion)}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
            </div>
          )}
          
          {allSuggestions.some(s => s.type === 'command') && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-foreground/50 border-t">
                Commands
              </div>
              {allSuggestions
                .filter(s => s.type === 'command')
                .map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    highlighted={highlightedIndex === allSuggestions.indexOf(suggestion)}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Suggestion item component
const SuggestionItem: React.FC<{
  suggestion: SearchSuggestion
  highlighted: boolean
  onClick: () => void
}> = ({ suggestion, highlighted, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-3 py-2 flex items-center gap-3',
        'hover:bg-foreground/5 transition-colors text-left',
        highlighted && 'bg-foreground/10',
        suggestion.type === 'command' && 'font-mono'
      )}
    >
      {suggestion.icon && (
        <div className="flex-shrink-0 text-foreground/50">
          {suggestion.icon}
        </div>
      )}
      <div className="flex-1">
        <div className="text-sm">{suggestion.text}</div>
        {suggestion.meta && (
          <div className="text-xs text-foreground/50">{suggestion.meta}</div>
        )}
      </div>
      {suggestion.category && (
        <Badge size="sm" variant="default">
          {suggestion.category}
        </Badge>
      )}
    </button>
  )
}