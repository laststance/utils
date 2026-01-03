'use client'

import { MoveUp } from 'lucide-react'
import React, { useSyncExternalStore, useCallback, type ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Scroll threshold in pixels. The button will be displayed when the page is scrolled down this amount or more.
 */
const SCROLL_THRESHOLD = 200

/**
 * Subscribe to window scroll events.
 * @param callback - The callback to invoke when scroll position changes.
 * @returns A cleanup function to unsubscribe.
 */
function subscribeToScroll(callback: () => void): () => void {
  window.addEventListener('scroll', callback)
  return () => window.removeEventListener('scroll', callback)
}

/**
 * Get the current scroll visibility state.
 * @returns true if scroll position exceeds threshold, false otherwise.
 */
function getScrollVisibility(): boolean {
  return window.scrollY > SCROLL_THRESHOLD
}

/**
 * SSR fallback for scroll visibility.
 * @returns false since there is no scroll on the server.
 */
function getServerSnapshot(): boolean {
  return false
}

type Props = {
  className?: string
  circle?: boolean
  size?: 'normal' | 'large' | 'small'
} & Omit<ComponentProps<typeof Button>, 'size'>

/**
Although it doesn't work well on Storybook, it will be displayed at the bottom right of the screen regardless of where it's placed on the page.<br/>
It is hidden when not scrolling and displayed when the page is scrolled down 200px or more.

## Props

```ts
type Props = {
  className?: string
  circle: boolean
  size: "normal" | "large" | "small"
} & ComponentProps<typeof Button>
```
*/
export const ScrollToTop: React.FC<Props> = ({
  className,
  circle = true,
  size = 'small',
  ...props
}) => {
  const visible = useSyncExternalStore(
    subscribeToScroll,
    getScrollVisibility,
    getServerSnapshot
  )

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  // Map size prop to Button component size
  const buttonSizeMap: Record<'small' | 'normal' | 'large', 'sm' | 'default' | 'lg'> = {
    small: 'sm',
    normal: 'default',
    large: 'lg',
  }

  // Map size prop to icon size
  const iconSizeMap: Record<'small' | 'normal' | 'large', number> = {
    small: 16,
    normal: 20,
    large: 24,
  }

  // Map size prop to button size when circle is true (icon size + padding)
  const circleButtonSizeMap: Record<'small' | 'normal' | 'large', number> = {
    small: 32, // icon 16px + padding 16px
    normal: 40, // icon 20px + padding 20px
    large: 48, // icon 24px + padding 24px
  }

  const sizeKey: 'small' | 'normal' | 'large' = size ?? 'small'
  const buttonSize = buttonSizeMap[sizeKey]
  const iconSize = iconSizeMap[sizeKey]
  const circleButtonSize = circleButtonSizeMap[sizeKey]

  return (
    <Button
      type="button"
      onClick={scrollToTop}
      size={circle ? 'icon' : buttonSize}
      className={cn(
        'fixed bottom-5 right-5',
        circle && 'rounded-full p-0 flex items-center justify-center',
        !circle && 'p-4',
        visible ? 'block' : 'hidden',
        className,
      )}
      style={{
        zIndex: 99,
        ...(circle && {
          width: `${circleButtonSize}px`,
          height: `${circleButtonSize}px`,
        }),
      }}
      {...props}
    >
      <span className="flex items-center justify-center w-full h-full">
        <MoveUp size={iconSize} />
      </span>
    </Button>
  )
}
