import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge and conditionally apply CSS classes.
 * Combines clsx for conditional classes and tailwind-merge for Tailwind CSS conflicts.
 *
 * This is a common pattern in React components using Tailwind CSS to:
 * - Apply conditional classes
 * - Merge classes from props
 * - Resolve Tailwind class conflicts
 *
 * @param inputs - Class values that can be strings, objects, arrays, or conditional
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('btn', {
 *   'btn-primary': isPrimary,
 *   'btn-disabled': isDisabled
 * }) // 'btn btn-primary' or 'btn btn-disabled'
 *
 * // Tailwind conflict resolution
 * cn('p-4 p-6') // 'p-6' (later padding wins)
 * cn('text-red-500 text-blue-500') // 'text-blue-500' (later color wins)
 *
 * // Component usage
 * function Button({ className, variant, ...props }) {
 *   return (
 *     <button
 *       className={cn(
 *         'px-4 py-2 rounded font-medium',
 *         {
 *           'bg-blue-500 text-white': variant === 'primary',
 *           'bg-gray-200 text-gray-900': variant === 'secondary'
 *         },
 *         className
 *       )}
 *       {...props}
 *     />
 *   )
 * }
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
