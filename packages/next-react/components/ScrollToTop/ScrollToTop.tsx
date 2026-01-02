'use client'

import { MoveUp } from 'lucide-react'
import React, { useState, useEffect, type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
  circle?: boolean
  size?: 'normal' | 'large' | 'small'
} & ComponentProps<typeof Button>

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
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <Button
      type="button"
      onClick={scrollToTop}
      className={cn(
        'p-4 fixed bottom-5 right-5',
        visible ? 'block' : 'hidden',
        className,
      )}
      style={{ zIndex: 99 }}
      {...props}
      asChild
    >
      <MoveUp size={16} />
    </Button>
  )
}
