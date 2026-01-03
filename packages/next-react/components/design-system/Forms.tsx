'use client'

import { Check, ChevronDown, Search, X, Upload, Plus, Minus } from 'lucide-react'
import React, { useState } from 'react'

import { radius, shadows } from '@/lib/design-system/spacing'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

// Select Component
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  hint?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal'
  disabled?: boolean
  searchable?: boolean
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  hint,
  theme = 'glass-clear',
  variant = 'default',
  disabled = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selectedTheme = themes[theme]
  
  const filteredOptions = searchable 
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options
  
  const selectedOption = options.find(opt => opt.value === value)
  
  const variantClasses = {
    default: cn(
      'bg-background/50',
      'border border-border',
      'hover:border-primary/50'
    ),
    glass: cn(
      selectedTheme?.card,
      selectedTheme?.blur,
      'border border-white/10',
      'hover:border-primary/50'
    ),
    minimal: cn(
      'bg-transparent',
      'border-b border-border',
      'rounded-none',
      'hover:border-primary'
    ),
  }
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label className={cn(
          typography.subheadline.className,
          'text-foreground/70 block'
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-2.5 text-left',
            'flex items-center justify-between',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            radius.lg,
            variantClasses[variant],
            error && 'border-destructive',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className={cn(
            selectedOption ? 'text-foreground' : 'text-foreground/40'
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown 
            size={18} 
            className={cn(
              'text-foreground/50 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        
        {isOpen && (
          <div className={cn(
            'absolute z-50 w-full mt-1',
            'bg-background border border-border',
            'max-h-60 overflow-auto',
            radius.lg,
            shadows.dropdown
          )}>
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground/50" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-sm text-foreground/50">
                No options found
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value)
                      setIsOpen(false)
                      setSearch('')
                    }
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left flex items-center gap-2',
                    'hover:bg-foreground/5 transition-colors',
                    option.value === value && 'bg-primary/10 text-primary',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={option.disabled}
                >
                  {option.icon}
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && <Check size={16} />}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className={cn(typography.caption1.className, 'text-foreground/50')}>
          {hint}
        </p>
      )}
      
      {error && (
        <p className={cn(typography.caption1.className, 'text-destructive')}>
          {error}
        </p>
      )}
    </div>
  )
}

// Checkbox Component
export interface CheckboxProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  error?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'rounded'
  size?: 'sm' | 'md' | 'lg'
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  theme = 'glass-clear',
  variant = 'default',
  size = 'md',
}) => {
  const selectedTheme = themes[theme]
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  
  const variantClasses = {
    default: 'rounded',
    glass: cn('rounded', selectedTheme?.card, selectedTheme?.blur),
    rounded: 'rounded-full',
  }
  
  return (
    <label className={cn(
      'flex items-start gap-2.5 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={cn(
          sizeClasses[size],
          variantClasses[variant],
          'border-2 transition-all duration-200',
          checked 
            ? 'bg-primary border-primary' 
            : 'bg-background border-border hover:border-primary/50',
          error && 'border-destructive'
        )}>
          {checked && (
            <Check 
              className="text-primary-foreground w-full h-full p-0.5" 
              strokeWidth={3}
            />
          )}
        </div>
      </div>
      
      {label && (
        <span className={cn(
          size === 'sm' && typography.caption1.className,
          size === 'md' && typography.subheadline.className,
          size === 'lg' && typography.body.className,
          'text-foreground/80'
        )}>
          {label}
        </span>
      )}
    </label>
  )
}

// Radio Button Component
export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  name: string
  label?: string
  error?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'cards'
  orientation?: 'horizontal' | 'vertical'
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
  label,
  error,
  theme = 'glass-clear',
  variant = 'default',
  orientation = 'vertical',
}) => {
  const selectedTheme = themes[theme]
  
  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          typography.subheadline.className,
          'text-foreground/70 block mb-3'
        )}>
          {label}
        </label>
      )}
      
      <div className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}>
        {options.map(option => (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer',
              variant === 'cards' && [
                'flex-1 p-4 rounded-lg border-2 transition-all',
                selectedTheme?.card,
                value === option.value 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50',
              ],
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-start gap-2.5">
              <div className="relative mt-0.5">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => !option.disabled && onChange?.(option.value)}
                  disabled={option.disabled}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all duration-200',
                  'flex items-center justify-center',
                  value === option.value 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/50',
                  error && 'border-destructive'
                )}>
                  {value === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <span className={cn(
                  typography.subheadline.className,
                  'text-foreground/80 block'
                )}>
                  {option.label}
                </span>
                {option.description && (
                  <span className={cn(
                    typography.caption1.className,
                    'text-foreground/50 block mt-0.5'
                  )}>
                    {option.description}
                  </span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      
      {error && (
        <p className={cn(typography.caption1.className, 'text-destructive mt-1')}>
          {error}
        </p>
      )}
    </div>
  )
}

// Switch/Toggle Component
export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5' },
    lg: { track: 'w-14 h-8', thumb: 'w-7 h-7' },
  }
  
  return (
    <label className={cn(
      'inline-flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={cn(
          sizeClasses[size].track,
          'rounded-full transition-all duration-200',
          checked 
            ? 'bg-primary' 
            : 'bg-gray-300 dark:bg-gray-600'
        )}>
          <div className={cn(
            sizeClasses[size].thumb,
            'bg-white rounded-full transition-all duration-200',
            'absolute top-0.5',
            checked 
              ? size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-5' : 'translate-x-6'
              : 'translate-x-0.5'
          )} />
        </div>
      </div>
      
      {label && (
        <span className={cn(typography.body.className, 'text-foreground/80')}>
          {label}
        </span>
      )}
    </label>
  )
}

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = ({ ref, className, label, error, hint, theme = 'glass-clear', variant = 'default', resize = 'vertical', disabled, id, ...props }: TextareaProps & { ref?: React.RefObject<HTMLTextAreaElement | null> }) => {
  const selectedTheme = themes[theme]
  const generatedId = React.useId()
  const textareaId = id || generatedId
  
  const variantClasses = {
    default: cn(
      'bg-background/50',
      'border border-border',
      'focus:border-primary'
    ),
    glass: cn(
      selectedTheme?.card,
      selectedTheme?.blur,
      'border border-white/10',
      'focus:border-primary/50'
    ),
    minimal: cn(
      'bg-transparent',
      'border border-border',
      'focus:border-primary'
    ),
  }
  
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  }
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={textareaId}
          className={cn(
            typography.subheadline.className,
            'text-foreground/70 block'
          )}
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2.5 min-h-[100px]',
          'text-foreground placeholder:text-foreground/40',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          radius.lg,
          variantClasses[variant],
          resizeClasses[resize],
          error && 'border-destructive focus:border-destructive',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
      
      {hint && !error && (
        <p className={cn(typography.caption1.className, 'text-foreground/50')}>
          {hint}
        </p>
      )}
      
      {error && (
        <p className={cn(typography.caption1.className, 'text-destructive')}>
          {error}
        </p>
      )}
    </div>
  )
}

Textarea.displayName = 'Textarea'

// File Upload Component
export interface FileUploadProps {
  onFileSelect?: (files: FileList) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
  theme?: keyof typeof themes
  variant?: 'default' | 'dropzone'
  maxSize?: number // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  multiple = false,
  label = 'Upload files',
  hint = 'or drag and drop',
  theme = 'glass-clear',
  variant = 'dropzone',
  maxSize = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const selectedTheme = themes[theme]
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }
  
  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= maxSize
    })
    
    if (multiple) {
      setFiles([...files, ...validFiles])
    } else {
      setFiles(validFiles.slice(0, 1))
    }
    
    onFileSelect?.(validFiles as any)
  }
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }
  
  if (variant === 'dropzone') {
    return (
      <div className="space-y-3">
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative block w-full p-8',
            'border-2 border-dashed rounded-xl',
            'cursor-pointer transition-all duration-200',
            'hover:border-primary/50 hover:bg-primary/5',
            isDragging ? 'border-primary bg-primary/10' : 'border-border',
            selectedTheme?.card,
            selectedTheme?.blur
          )}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            className="sr-only"
          />
          
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-foreground/30 mb-3" />
            <p className={cn(typography.body.className, 'text-foreground/70')}>
              {label}
            </p>
            <p className={cn(typography.caption1.className, 'text-foreground/50 mt-1')}>
              {hint}
            </p>
            <p className={cn(typography.caption2.className, 'text-foreground/40 mt-2')}>
              Max file size: {maxSize}MB
            </p>
          </div>
        </label>
        
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-foreground/5 rounded-lg"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <label className="inline-block">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        className="sr-only"
      />
      <div className={cn(
        'px-4 py-2 rounded-lg cursor-pointer',
        'inline-flex items-center gap-2',
        'transition-all duration-200',
        selectedTheme?.card,
        selectedTheme?.blur,
        'border border-border hover:border-primary/50'
      )}>
        <Upload size={18} />
        <span>{label}</span>
      </div>
    </label>
  )
}

// Slider Component
export interface SliderProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  disabled?: boolean
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
}) => {
  const percentage = ((value - min) / (max - min)) * 100
  
  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className={cn(
              typography.subheadline.className,
              'text-foreground/70'
            )}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={cn(
              typography.body.className,
              'text-foreground/80'
            )}>
              {value}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
            'dark:bg-gray-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            background: `linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`,
          }}
        />
      </div>
    </div>
  )
}

// Number Input Component
export interface NumberInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  error?: string
  theme?: keyof typeof themes
  showControls?: boolean
  disabled?: boolean
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  label,
  error,
  theme = 'glass-clear',
  showControls = true,
  disabled = false,
}) => {
  const selectedTheme = themes[theme]
  
  const handleIncrement = () => {
    const newValue = value + step
    if (max === undefined || newValue <= max) {
      onChange?.(newValue)
    }
  }
  
  const handleDecrement = () => {
    const newValue = value - step
    if (min === undefined || newValue >= min) {
      onChange?.(newValue)
    }
  }
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label className={cn(
          typography.subheadline.className,
          'text-foreground/70 block'
        )}>
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        {showControls && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && value <= min)}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'border border-border hover:border-primary/50',
              'transition-all duration-200',
              selectedTheme?.card,
              selectedTheme?.blur,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Minus size={16} />
          </button>
        )}
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'flex-1 px-3 py-2 text-center',
            'bg-background/50 border border-border',
            'rounded-lg transition-all duration-200',
            'focus:outline-none focus:border-primary',
            error && 'border-destructive',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        
        {showControls && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && value >= max)}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'border border-border hover:border-primary/50',
              'transition-all duration-200',
              selectedTheme?.card,
              selectedTheme?.blur,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      
      {error && (
        <p className={cn(typography.caption1.className, 'text-destructive')}>
          {error}
        </p>
      )}
    </div>
  )
}