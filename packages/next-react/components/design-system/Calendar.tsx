'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState, useMemo } from 'react'

import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

import { Button } from './Button'

export interface CalendarProps {
  value?: Date | Date[]
  onChange?: (date: Date | Date[]) => void
  multiple?: boolean
  range?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  highlightedDates?: Date[]
  showWeekNumbers?: boolean
  firstDayOfWeek?: 0 | 1
  locale?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  multiple = false,
  range = false,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  locale = 'en-US',
  theme = 'glass-aurora',
  variant = 'glass',
  size = 'md',
  className,
}) => {
  const selectedTheme = themes[theme]
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [, setHoveredDate] = useState<Date | null>(null)
  
  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2000, i, 1)
      return formatter.format(date)
    })
  }, [locale])
  
  const weekDayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(2000, 0, 2 + i) // Starting from Sunday
      days.push(formatter.format(date))
    }
    if (firstDayOfWeek === 1) {
      days.push(days.shift()!) // Move Sunday to end
    }
    return days
  }, [locale, firstDayOfWeek])
  
  const calendar = useMemo(() => {
    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }
    
    const getFirstDayOfMonth = (date: Date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
      return firstDayOfWeek === 1 ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay
    }
    
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    
    const days: (Date | null)[] = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }, [currentMonth, firstDayOfWeek])
  
  const isDateSelected = (date: Date) => {
    if (!value || !date) return false
    
    if (Array.isArray(value)) {
      return value.some(d => isSameDay(d, date))
    }
    return isSameDay(value, date)
  }
  
  const isDateDisabled = (date: Date) => {
    if (!date) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return disabledDates.some(d => isSameDay(d, date))
  }
  
  const isDateHighlighted = (date: Date) => {
    if (!date) return false
    return highlightedDates.some(d => isSameDay(d, date))
  }
  
  const isToday = (date: Date) => {
    if (!date) return false
    return isSameDay(date, new Date())
  }
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }
  
  const isInRange = (date: Date) => {
    if (!range || !Array.isArray(value) || value.length !== 2 || !date) return false
    const [start, end] = value
    return start && end && date >= start && date <= end
  }
  
  const handleDateClick = (date: Date) => {
    if (!date || isDateDisabled(date)) return
    
    if (range) {
      if (!value || !Array.isArray(value) || value.length === 0) {
        onChange?.([date])
      } else if (value.length === 1) {
        const [start] = value
        if (start) {
          onChange?.(date > start ? [start, date] : [date, start])
        }
      } else {
        onChange?.([date])
      }
    } else if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const exists = currentValues.some(d => isSameDay(d, date))
      if (exists) {
        onChange?.(currentValues.filter(d => !isSameDay(d, date)))
      } else {
        onChange?.([...currentValues, date])
      }
    } else {
      onChange?.(date)
    }
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const sizeClasses = {
    sm: 'text-xs p-1',
    md: 'text-sm p-2',
    lg: 'text-base p-3',
  }
  
  const variantClasses = {
    default: 'bg-background border border-border',
    glass: cn(selectedTheme?.card, selectedTheme?.blur, 'border border-white/10'),
    minimal: 'bg-transparent',
  }
  
  return (
    <div className={cn(
      'p-4 rounded-lg',
      variantClasses[variant],
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
        >
          <ChevronLeft size={16} />
        </Button>
        
        <h3 className={cn(typography.subheadline.className, 'font-semibold')}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      
      {/* Weekday headers */}
      <div className={cn(
        'grid grid-cols-7 mb-2',
        showWeekNumbers && 'grid-cols-8'
      )}>
        {showWeekNumbers && <div />}
        {weekDayNames.map(day => (
          <div
            key={day}
            className={cn(
              'text-center font-medium text-foreground/60',
              sizeClasses[size]
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className={cn(
        'grid grid-cols-7',
        showWeekNumbers && 'grid-cols-8'
      )}>
        {calendar.map((date, index) => {
          const weekNumber = date ? Math.ceil(date.getDate() / 7) : null
          
          return (
            <React.Fragment key={index}>
              {showWeekNumbers && index % 7 === 0 && (
                <div className={cn(
                  'text-center text-foreground/40',
                  sizeClasses[size]
                )}>
                  {weekNumber}
                </div>
              )}
              <button
                onClick={() => date && handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!date || isDateDisabled(date)}
                className={cn(
                  'relative rounded-md transition-all',
                  sizeClasses[size],
                  date && 'hover:bg-foreground/10',
                  isDateSelected(date!) && 'bg-primary text-white',
                  isInRange(date!) && 'bg-primary/20',
                  isToday(date!) && 'ring-2 ring-primary',
                  isDateHighlighted(date!) && 'font-bold',
                  isDateDisabled(date!) && 'opacity-30 cursor-not-allowed',
                  !date && 'invisible'
                )}
              >
                {date?.getDate()}
              </button>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}