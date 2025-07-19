import { describe, it, expect } from 'vitest'

import { cn } from './utils'

describe('cn utility function', () => {
  describe('basic functionality', () => {
    it('should be a function', () => {
      expect(typeof cn).toBe('function')
    })

    it('should merge simple class strings', () => {
      const result = cn('px-4 py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should handle single class string', () => {
      const result = cn('text-center')
      expect(result).toBe('text-center')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle empty strings', () => {
      const result = cn('', '', '')
      expect(result).toBe('')
    })

    it('should filter out falsy values', () => {
      const result = cn('px-4', false, null, undefined, '', 'py-2')
      expect(result).toBe('px-4 py-2')
    })
  })

  describe('conditional classes with objects', () => {
    it('should apply classes based on boolean conditions', () => {
      const result = cn('btn', {
        'btn-primary': true,
        'btn-disabled': false,
        'btn-large': true,
      })
      expect(result).toBe('btn btn-primary btn-large')
    })

    it('should handle all false conditions', () => {
      const result = cn('btn', {
        'btn-primary': false,
        'btn-disabled': false,
      })
      expect(result).toBe('btn')
    })

    it('should handle all true conditions', () => {
      const result = cn('btn', {
        'btn-primary': true,
        'btn-disabled': true,
        'btn-large': true,
      })
      expect(result).toBe('btn btn-primary btn-disabled btn-large')
    })

    it('should handle mixed string and object inputs', () => {
      const result = cn(
        'base-class',
        { active: true, disabled: false },
        'additional-class',
      )
      expect(result).toBe('base-class active additional-class')
    })
  })

  describe('array inputs', () => {
    it('should handle array of class strings', () => {
      const result = cn(['px-4', 'py-2'], ['bg-blue-500', 'text-white'])
      expect(result).toBe('px-4 py-2 bg-blue-500 text-white')
    })

    it('should handle nested arrays', () => {
      const result = cn(['px-4', ['py-2', 'bg-blue-500']], 'text-white')
      expect(result).toBe('px-4 py-2 bg-blue-500 text-white')
    })

    it('should handle arrays with conditional objects', () => {
      const result = cn(
        ['px-4', { 'py-2': true, 'py-4': false }],
        'bg-blue-500',
      )
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should filter falsy values in arrays', () => {
      const result = cn(
        ['px-4', false, null, 'py-2'],
        ['', undefined, 'bg-blue-500'],
      )
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })
  })

  describe('tailwind class conflict resolution', () => {
    it('should resolve padding conflicts (later wins)', () => {
      const result = cn('p-4', 'p-6')
      expect(result).toBe('p-6')
    })

    it('should resolve margin conflicts', () => {
      const result = cn('m-2', 'm-4', 'm-1')
      expect(result).toBe('m-1')
    })

    it('should resolve text color conflicts', () => {
      const result = cn('text-red-500', 'text-blue-500', 'text-green-500')
      expect(result).toBe('text-green-500')
    })

    it('should resolve background color conflicts', () => {
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })

    it('should resolve width conflicts', () => {
      const result = cn('w-4', 'w-8', 'w-full')
      expect(result).toBe('w-full')
    })

    it('should resolve height conflicts', () => {
      const result = cn('h-10', 'h-20', 'h-auto')
      expect(result).toBe('h-auto')
    })

    it('should handle complex conflicts with multiple properties', () => {
      const result = cn('p-4 text-red-500 bg-blue-100', 'p-6 text-green-500')
      expect(result).toBe('bg-blue-100 p-6 text-green-500')
    })

    it('should preserve non-conflicting classes', () => {
      const result = cn('px-4 text-red-500', 'py-2 bg-blue-500')
      expect(result).toBe('px-4 text-red-500 py-2 bg-blue-500')
    })
  })

  describe('responsive and state variants', () => {
    it('should handle responsive classes without conflicts', () => {
      const result = cn('p-4', 'md:p-6', 'lg:p-8')
      expect(result).toBe('p-4 md:p-6 lg:p-8')
    })

    it('should handle hover and focus states', () => {
      const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700')
      expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700')
    })

    it('should handle dark mode variants', () => {
      const result = cn('bg-white text-black', 'dark:bg-black dark:text-white')
      expect(result).toBe('bg-white text-black dark:bg-black dark:text-white')
    })

    it('should handle responsive conflicts correctly', () => {
      const result = cn('p-4 md:p-6', 'md:p-8')
      expect(result).toBe('p-4 md:p-8')
    })

    it('should handle state variant conflicts', () => {
      const result = cn('hover:bg-blue-500', 'hover:bg-red-500')
      expect(result).toBe('hover:bg-red-500')
    })
  })

  describe('component usage patterns', () => {
    it('should handle button component pattern', () => {
      const getButtonClasses = (
        variant: 'primary' | 'secondary',
        className?: string,
      ) => {
        return cn(
          'px-4 py-2 rounded font-medium', // base styles
          {
            'bg-blue-500 text-white': variant === 'primary',
            'bg-gray-200 text-gray-900': variant === 'secondary',
          },
          className, // custom override
        )
      }

      const result = getButtonClasses('primary', 'custom-button-class')
      expect(result).toBe(
        'px-4 py-2 rounded font-medium bg-blue-500 text-white custom-button-class',
      )
    })

    it('should handle input component pattern', () => {
      const hasError = true
      const isDisabled = false
      const customClass = 'my-input'

      const result = cn(
        'w-full px-3 py-2 border rounded', // base
        {
          'border-red-500 focus:border-red-600': hasError,
          'border-gray-300 focus:border-blue-500': !hasError,
          'opacity-50 cursor-not-allowed': isDisabled,
        },
        customClass,
      )

      expect(result).toBe(
        'w-full px-3 py-2 border rounded border-red-500 focus:border-red-600 my-input',
      )
    })

    it('should handle card component pattern', () => {
      const getCardClasses = (
        isInteractive: boolean,
        size: 'small' | 'medium' | 'large',
      ) => {
        return cn(
          'bg-white border rounded shadow', // base
          {
            'hover:shadow-lg cursor-pointer': isInteractive,
            'p-4': size === 'small',
            'p-6': size === 'medium',
            'p-8': size === 'large',
          },
        )
      }

      const result = getCardClasses(true, 'large')
      expect(result).toBe(
        'bg-white border rounded shadow hover:shadow-lg cursor-pointer p-8',
      )
    })

    it('should handle modal/dialog component pattern', () => {
      const getModalClasses = (
        isOpen: boolean,
        size: 'small' | 'medium' | 'large',
      ) => {
        return cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          {
            hidden: !isOpen,
            block: isOpen,
          },
          'bg-black bg-opacity-50',
          {
            'p-4': size === 'small',
            'p-6': size === 'medium',
            'p-8': size === 'large',
          },
        )
      }

      const result = getModalClasses(true, 'medium')
      expect(result).toBe(
        'fixed inset-0 z-50 items-center justify-center block bg-opacity-50 p-6',
      )
    })
  })

  describe('edge cases and complex scenarios', () => {
    it('should handle very long class strings', () => {
      const longClasses = Array.from(
        { length: 100 },
        (_, i) => `class-${i}`,
      ).join(' ')
      const result = cn(longClasses, 'additional-class')
      expect(result).toContain('additional-class')
      expect(result.split(' ').length).toBe(101)
    })

    it('should handle classes with special characters', () => {
      const result = cn(
        'before:content-[""]',
        'after:content-["→"]',
        'data-[state=open]:animate-in',
      )
      expect(result).toBe(
        'before:content-[""] after:content-["→"] data-[state=open]:animate-in',
      )
    })

    it('should handle numeric class names', () => {
      const result = cn(
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
      )
      expect(result).toBe(
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      )
    })

    it('should handle arbitrary value classes', () => {
      const result = cn('w-[200px]', 'h-[100px]', 'bg-[#1da1f2]')
      expect(result).toBe('w-[200px] h-[100px] bg-[#1da1f2]')
    })

    it('should handle conflicting arbitrary values', () => {
      const result = cn('w-[200px]', 'w-[300px]')
      expect(result).toBe('w-[300px]')
    })

    it('should handle deeply nested conditions', () => {
      const result = cn(
        'base',
        {
          group1: true,
          group2: {
            nested1: true,
            nested2: false,
          },
        },
        [
          'array1',
          {
            array2: true,
            array3: false,
          },
        ],
      )
      // Note: clsx doesn't handle nested objects in conditions, so this should flatten
      expect(result).toContain('base')
      expect(result).toContain('group1')
      expect(result).toContain('array1')
      expect(result).toContain('array2')
    })

    it('should handle undefined and null in complex scenarios', () => {
      const result = cn(
        'base',
        // @ts-expect-error Testing intentionally falsy expressions
        null && 'conditional',
        undefined,
        false && 'another-conditional',
        0 && 'zero-conditional',
        // @ts-expect-error Testing intentionally falsy expressions
        '' && 'empty-conditional',
        'valid-class',
      )
      expect(result).toBe('base valid-class')
    })
  })

  describe('performance considerations', () => {
    it('should handle many class combinations efficiently', () => {
      const startTime = performance.now()

      for (let i = 0; i < 1000; i++) {
        cn(
          'base-class',
          { active: i % 2 === 0 },
          { disabled: i % 3 === 0 },
          `dynamic-${i % 5}`,
          i % 4 === 0 ? 'special' : null,
        )
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete 1000 operations quickly
      expect(duration).toBeLessThan(100)
    })

    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => `class-${i}`)

      const startTime = performance.now()
      const result = cn(...largeArray)
      const endTime = performance.now()

      expect(result).toContain('class-0')
      expect(result).toContain('class-999')
      expect(endTime - startTime).toBeLessThan(50)
    })
  })

  describe('real-world integration patterns', () => {
    it('should work with component prop spreading', () => {
      const buttonProps = {
        className: cn('btn', 'btn-primary'),
        disabled: false,
      }

      expect(buttonProps.className).toBe('btn btn-primary')
    })

    it('should handle conditional rendering patterns', () => {
      const showBorder = true
      const isLarge = false
      const customClasses = 'my-custom-class'

      const result = cn(
        'base-component',
        showBorder && 'border border-gray-300',
        isLarge ? 'text-lg p-4' : 'text-sm p-2',
        customClasses,
      )

      expect(result).toBe(
        'base-component border border-gray-300 text-sm p-2 my-custom-class',
      )
    })

    it('should handle theme-based class application', () => {
      const getThemedClasses = (
        theme: 'light' | 'dark',
        variant: 'danger' | 'primary' | 'secondary',
      ) => {
        return cn(
          'button',
          {
            'bg-white text-black': theme === 'light',
            'bg-black text-white': theme === 'dark',
          },
          {
            'border-red-500': variant === 'danger',
            'border-blue-500': variant === 'primary',
            'border-gray-500': variant === 'secondary',
          },
        )
      }

      const result = getThemedClasses('dark', 'danger')
      expect(result).toBe('button bg-black text-white border-red-500')
    })

    it('should handle form validation state classes', () => {
      const getFormClasses = (
        validationState: 'default' | 'success' | 'error' | 'warning',
        isFocused: boolean,
      ) => {
        return cn(
          'input border rounded px-3 py-2',
          {
            'border-gray-300': validationState === 'default',
            'border-green-500 bg-green-50': validationState === 'success',
            'border-red-500 bg-red-50': validationState === 'error',
            'border-yellow-500 bg-yellow-50': validationState === 'warning',
          },
          {
            'ring-2 ring-opacity-50': isFocused,
            'ring-red-200': isFocused && validationState === 'error',
            'ring-green-200': isFocused && validationState === 'success',
          },
        )
      }

      const result = getFormClasses('error', true)
      expect(result).toBe(
        'input border rounded px-3 py-2 border-red-500 bg-red-50 ring-2 ring-red-200',
      )
    })
  })

  describe('type safety and TypeScript integration', () => {
    it('should accept string inputs', () => {
      const result = cn('class1', 'class2')
      expect(typeof result).toBe('string')
    })

    it('should accept conditional object inputs', () => {
      const result = cn({ class1: true, class2: false })
      expect(typeof result).toBe('string')
    })

    it('should accept array inputs', () => {
      const result = cn(['class1', 'class2'])
      expect(typeof result).toBe('string')
    })

    it('should accept mixed input types', () => {
      const result = cn('string', { conditional: true }, ['array', 'items'])
      expect(typeof result).toBe('string')
    })

    it('should handle falsy values gracefully', () => {
      const result = cn('valid', null, undefined, false, '', 0)
      expect(result).toBe('valid')
    })
  })
})
