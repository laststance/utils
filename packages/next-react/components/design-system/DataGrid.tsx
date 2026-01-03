'use client'

import { 
  ChevronUp, 
  ChevronDown, 
  Filter,
  GripVertical
} from 'lucide-react'
import React, { useState, useMemo, useRef } from 'react'

import { themes } from '@/lib/design-system/themes'
import { cn } from '@/lib/utils'

import { Input } from './Auth'
import { Button } from './Button'
import { Badge } from './Feedback'
import { Checkbox } from './Forms'

export interface Column<T = any> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => any)
  width?: number
  minWidth?: number
  maxWidth?: number
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  draggable?: boolean
  sticky?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
  filterRender?: () => React.ReactNode
  headerRender?: () => React.ReactNode
}

export interface DataGridProps<T = any> {
  data: T[]
  columns: Column<T>[]
  theme?: keyof typeof themes
  variant?: 'default' | 'striped' | 'bordered' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  
  // Features
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  draggable?: boolean
  selectable?: boolean
  editable?: boolean
  virtualScroll?: boolean
  pagination?: boolean
  
  // Pagination
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  
  // Selection
  selectedRows?: T[]
  onSelectionChange?: (rows: T[]) => void
  
  // Sorting
  defaultSort?: { columnId: string; direction: 'asc' | 'desc' }
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void
  
  // Filtering
  onFilter?: (filters: Record<string, any>) => void
  
  // Row actions
  rowActions?: (row: T) => React.ReactNode
  onRowClick?: (row: T, index: number) => void
  onRowDoubleClick?: (row: T, index: number) => void
  
  // Drag and drop
  onRowReorder?: (fromIndex: number, toIndex: number) => void
  onColumnReorder?: (fromIndex: number, toIndex: number) => void
  
  // Other
  loading?: boolean
  emptyMessage?: string
  className?: string
  headerClassName?: string
  rowClassName?: string | ((row: T, index: number) => string)
}

export function DataGrid<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  theme = 'glass-aurora',
  variant = 'default',
  size = 'md',
  sortable = true,
  filterable = false,
  resizable = false,
  draggable = false,
  selectable = false,
  editable = false,
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onSelectionChange,
  defaultSort,
  onSort,
  onFilter,
  rowActions,
  onRowClick,
  onRowDoubleClick,
  onRowReorder,
  onColumnReorder,
  loading = false,
  emptyMessage = 'No data available',
  className,
  headerClassName,
  rowClassName,
}: DataGridProps<T>) {
  const selectedTheme = themes[theme]
  const [columns, setColumns] = useState(initialColumns)
  const [sortColumn, setSortColumn] = useState(defaultSort?.columnId || '')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSort?.direction || 'asc')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set())
  const [draggedRow, setDraggedRow] = useState<number | null>(null)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null)
  
  const tableRef = useRef<HTMLTableElement>(null)
  const resizeRef = useRef<{ column: string; startX: number; startWidth: number } | null>(null)
  
  // Size classes
  const sizeClasses = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      headerPadding: 'px-2 py-2',
    },
    md: {
      padding: 'px-4 py-3',
      text: 'text-sm',
      headerPadding: 'px-4 py-3',
    },
    lg: {
      padding: 'px-6 py-4',
      text: 'text-base',
      headerPadding: 'px-6 py-4',
    },
  }
  
  const variantClasses = {
    default: '',
    striped: '[&>tbody>tr:nth-child(even)]:bg-foreground/5',
    bordered: 'border border-border',
    glass: cn(selectedTheme?.card, selectedTheme?.blur),
  }
  
  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data]
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter(row => {
        return Object.entries(filters).every(([columnId, filterValue]) => {
          if (!filterValue) return true
          const column = columns.find(c => c.id === columnId)
          if (!column) return true
          
          const value = typeof column.accessor === 'function' 
            ? column.accessor(row) 
            : row[column.accessor as keyof T]
          
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        })
      })
    }
    
    // Apply sorting
    if (sortColumn) {
      const column = columns.find(c => c.id === sortColumn)
      if (column) {
        result.sort((a, b) => {
          const aValue = typeof column.accessor === 'function' 
            ? column.accessor(a) 
            : a[column.accessor as keyof T]
          const bValue = typeof column.accessor === 'function' 
            ? column.accessor(b) 
            : b[column.accessor as keyof T]
          
          if (aValue === bValue) return 0
          
          const comparison = aValue > bValue ? 1 : -1
          return sortDirection === 'asc' ? comparison : -comparison
        })
      }
    }
    
    // Apply pagination
    if (pagination) {
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      result = result.slice(start, end)
    }
    
    return result
  }, [data, columns, filters, sortColumn, sortDirection, pagination, currentPage, pageSize])
  
  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sortable) return
    
    const newDirection = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(columnId)
    setSortDirection(newDirection)
    onSort?.(columnId, newDirection)
  }
  
  // Handle selection
  const handleSelectAll = () => {
    if (selectedRowIds.size === processedData.length) {
      setSelectedRowIds(new Set())
      onSelectionChange?.([])
    } else {
      const allIds = new Set(processedData.map((_, i) => i))
      setSelectedRowIds(allIds)
      onSelectionChange?.(processedData)
    }
  }
  
  const handleSelectRow = (index: number) => {
    const newSelection = new Set(selectedRowIds)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedRowIds(newSelection)
    onSelectionChange?.(processedData.filter((_, i) => newSelection.has(i)))
  }
  
  // Handle drag and drop for rows
  const handleRowDragStart = (e: React.DragEvent, index: number) => {
    setDraggedRow(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleRowDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleRowDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedRow !== null && draggedRow !== targetIndex) {
      onRowReorder?.(draggedRow, targetIndex)
    }
    setDraggedRow(null)
  }
  
  // Handle column drag and drop
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (draggedColumn && draggedColumn !== targetColumnId) {
      const fromIndex = columns.findIndex(c => c.id === draggedColumn)
      const toIndex = columns.findIndex(c => c.id === targetColumnId)
      if (fromIndex !== -1 && toIndex !== -1) {
        const newColumns = [...columns]
        const [removed] = newColumns.splice(fromIndex, 1)
        if (removed) {
          newColumns.splice(toIndex, 0, removed)
          setColumns(newColumns)
          onColumnReorder?.(fromIndex, toIndex)
        }
      }
    }
    setDraggedColumn(null)
  }
  
  // Handle column resize
  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault()
    const column = columns.find(c => c.id === columnId)
    if (!column) return
    
    resizeRef.current = {
      column: columnId,
      startX: e.clientX,
      startWidth: columnWidths[columnId] || column.width || 150,
    }
    
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }
  
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeRef.current) return
    
    const diff = e.clientX - resizeRef.current.startX
    const newWidth = Math.max(50, resizeRef.current.startWidth + diff)
    
    setColumnWidths(prev => ({
      ...prev,
      [resizeRef.current!.column]: newWidth,
    }))
  }
  
  const handleResizeEnd = () => {
    resizeRef.current = null
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }
  
  // Handle cell editing
  const handleCellEdit = (rowIndex: number, columnId: string, value: any) => {
    // This would typically update the data through a callback
    console.log('Edit cell:', { rowIndex, columnId, value })
    setEditingCell(null)
  }
  
  // Render cell content
  const renderCell = (row: T, column: Column<T>, rowIndex: number) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row) 
      : row[column.accessor as keyof T]
    
    if (editingCell?.row === rowIndex && editingCell?.column === column.id && editable) {
      return (
        <input
          type="text"
          defaultValue={value}
          className="w-full px-2 py-1 bg-transparent border border-primary rounded"
          autoFocus
          onBlur={(e) => handleCellEdit(rowIndex, column.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellEdit(rowIndex, column.id, e.currentTarget.value)
            } else if (e.key === 'Escape') {
              setEditingCell(null)
            }
          }}
        />
      )
    }
    
    if (column.render) {
      return column.render(value, row, rowIndex)
    }
    
    return value
  }
  
  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      {(filterable || selectable) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {selectable && selectedRowIds.size > 0 && (
              <Badge variant="primary">
                {selectedRowIds.size} selected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {filterable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Filters */}
      {showFilters && filterable && (
        <div className="mb-4 p-4 bg-foreground/5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.filter(c => c.filterable !== false).map(column => (
              <div key={column.id}>
                <label className="text-sm font-medium mb-1 block">
                  {column.header}
                </label>
                {column.filterRender ? (
                  column.filterRender()
                ) : (
                  <Input
                    type="text"
                    placeholder={`Filter ${column.header}...`}
                    value={filters[column.id] || ''}
                    onChange={(e) => {
                      const newFilters = { ...filters, [column.id]: e.target.value }
                      setFilters(newFilters)
                      onFilter?.(newFilters)
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className={cn(
        'overflow-auto rounded-lg',
        variantClasses[variant]
      )}>
        <table
          ref={tableRef}
          className="w-full table-fixed"
        >
          <thead className={cn(
            'bg-foreground/5 border-b border-border',
            headerClassName
          )}>
            <tr>
              {/* Selection column */}
              {selectable && (
                <th className={cn(
                  'w-12',
                  sizeClasses[size].headerPadding
                )}>
                  <Checkbox
                    checked={selectedRowIds.size === processedData.length && processedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {/* Drag handle column */}
              {draggable && onRowReorder && (
                <th className={cn(
                  'w-12',
                  sizeClasses[size].headerPadding
                )} />
              )}
              
              {/* Data columns */}
              {columns.map((column, _) => (
                <th
                  key={column.id}
                  className={cn(
                    'relative group',
                    sizeClasses[size].headerPadding,
                    sizeClasses[size].text,
                    'font-semibold text-foreground/70',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sticky === 'left' && 'sticky left-0 z-10 bg-background',
                    column.sticky === 'right' && 'sticky right-0 z-10 bg-background'
                  )}
                  style={{ width: columnWidths[column.id] || column.width }}
                  draggable={column.draggable !== false && draggable}
                  onDragStart={(e) => handleColumnDragStart(e, column.id)}
                  onDragOver={handleRowDragOver}
                  onDrop={(e) => handleColumnDrop(e, column.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {column.headerRender ? column.headerRender() : column.header}
                      
                      {/* Sort indicator */}
                      {sortable && column.sortable !== false && (
                        <button
                          onClick={() => handleSort(column.id)}
                          className="hover:text-foreground transition-colors"
                        >
                          {sortColumn === column.id ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <div className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Resize handle */}
                    {resizable && column.resizable !== false && (
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
                        onMouseDown={(e) => handleResizeStart(e, column.id)}
                      />
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions column */}
              {rowActions && (
                <th className={cn(
                  'w-20',
                  sizeClasses[size].headerPadding
                )} />
              )}
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (draggable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (draggable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="text-center py-8 text-foreground/50"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              processedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b border-border/50 hover:bg-foreground/5 transition-colors',
                    selectedRowIds.has(rowIndex) && 'bg-primary/10',
                    draggedRow === rowIndex && 'opacity-50',
                    typeof rowClassName === 'function' 
                      ? rowClassName(row, rowIndex) 
                      : rowClassName
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  onDoubleClick={() => onRowDoubleClick?.(row, rowIndex)}
                  draggable={draggable && !!onRowReorder}
                  onDragStart={(e) => handleRowDragStart(e, rowIndex)}
                  onDragOver={handleRowDragOver}
                  onDrop={(e) => handleRowDrop(e, rowIndex)}
                >
                  {/* Selection cell */}
                  {selectable && (
                    <td className={cn(
                      sizeClasses[size].padding
                    )}>
                      <Checkbox
                        checked={selectedRowIds.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                      />
                    </td>
                  )}
                  
                  {/* Drag handle cell */}
                  {draggable && onRowReorder && (
                    <td className={cn(
                      sizeClasses[size].padding,
                      'cursor-move'
                    )}>
                      <GripVertical size={16} className="text-foreground/30" />
                    </td>
                  )}
                  
                  {/* Data cells */}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        sizeClasses[size].padding,
                        sizeClasses[size].text,
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.sticky === 'left' && 'sticky left-0 z-10 bg-background',
                        column.sticky === 'right' && 'sticky right-0 z-10 bg-background'
                      )}
                      onDoubleClick={() => {
                        if (editable) {
                          setEditingCell({ row: rowIndex, column: column.id })
                        }
                      }}
                    >
                      {renderCell(row, column, rowIndex)}
                    </td>
                  ))}
                  
                  {/* Actions cell */}
                  {rowActions && (
                    <td className={cn(
                      sizeClasses[size].padding
                    )}>
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && !loading && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-foreground/60">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(data.length / pageSize) }, (_, i) => i + 1)
                .filter(page => {
                  const distance = Math.abs(page - currentPage)
                  return distance === 0 || distance === 1 || page === 1 || page === Math.ceil(data.length / pageSize)
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <Button
                      variant={page === currentPage ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => onPageChange?.(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === Math.ceil(data.length / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Column interface is already exported at the top of the file