'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import React from 'react'

import { themes } from '@/lib/design-system/themes'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  
  siblingCount?: number
  boundaryCount?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  showPageNumbers?: boolean
  
  variant?: 'default' | 'rounded' | 'dots' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  theme?: keyof typeof themes
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  variant = 'default',
  size = 'md',
  theme = 'glass-aurora',
  className,
}) => {
  const selectedTheme = themes[theme]
  
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }
  
  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5
    
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages)
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)
    
    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - boundaryCount - 1
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, 'dots', ...range(totalPages - boundaryCount + 1, totalPages)]
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [...range(1, boundaryCount), 'dots', ...rightRange]
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [
        ...range(1, boundaryCount),
        'dots',
        ...middleRange,
        'dots',
        ...range(totalPages - boundaryCount + 1, totalPages)
      ]
    }
    
    return []
  }, [currentPage, totalPages, siblingCount, boundaryCount])
  
  const sizeClasses = {
    sm: 'h-8 min-w-[32px] px-2 text-xs',
    md: 'h-10 min-w-[40px] px-3 text-sm',
    lg: 'h-12 min-w-[48px] px-4 text-base',
  }
  
  const variantClasses = {
    default: 'rounded-md',
    rounded: 'rounded-full',
    dots: 'rounded-full',
    minimal: '',
  }
  
  const buttonClasses = cn(
    'inline-flex items-center justify-center',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant]
  )
  
  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {/* First page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            buttonClasses,
            'hover:bg-foreground/10'
          )}
        >
          <ChevronsLeft size={16} />
        </button>
      )}
      
      {/* Previous page */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            buttonClasses,
            'hover:bg-foreground/10'
          )}
        >
          <ChevronLeft size={16} />
        </button>
      )}
      
      {/* Page numbers */}
      {showPageNumbers && paginationRange.map((pageNumber, index) => {
        if (pageNumber === 'dots') {
          return (
            <span
              key={`dots-${index}`}
              className={cn(buttonClasses, 'cursor-default')}
            >
              <MoreHorizontal size={16} />
            </span>
          )
        }
        
        const isActive = pageNumber === currentPage
        
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber as number)}
            className={cn(
              buttonClasses,
              isActive
                ? cn('bg-primary text-white', selectedTheme?.primary)
                : 'hover:bg-foreground/10'
            )}
          >
            {pageNumber}
          </button>
        )
      })}
      
      {/* Next page */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            buttonClasses,
            'hover:bg-foreground/10'
          )}
        >
          <ChevronRight size={16} />
        </button>
      )}
      
      {/* Last page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            buttonClasses,
            'hover:bg-foreground/10'
          )}
        >
          <ChevronsRight size={16} />
        </button>
      )}
    </nav>
  )
}