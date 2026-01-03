'use client'

import { 
  ChevronLeft, 
  ChevronRight,
  Pause,
  Play
} from 'lucide-react'
import React, { useState, useRef, useEffect, useCallback, Children, useSyncExternalStore } from 'react'

import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'


// Arrow button component - defined outside to avoid recreation on each render
interface ArrowButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
  arrowsPosition: 'inside' | 'outside' | 'corner'
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  onClick,
  disabled,
  arrowsPosition,
}) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  const positionClasses = {
    inside: cn(
      'absolute top-1/2 -translate-y-1/2 z-10',
      direction === 'prev' ? 'left-4' : 'right-4'
    ),
    outside: cn(
      'absolute top-1/2 -translate-y-1/2',
      direction === 'prev' ? '-left-12' : '-right-12'
    ),
    corner: cn(
      'absolute',
      direction === 'prev' ? 'top-4 left-4' : 'top-4 right-4'
    ),
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        positionClasses[arrowsPosition],
        'p-2 rounded-full',
        'bg-white/10 backdrop-blur-md border border-white/20',
        'hover:bg-white/20 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'text-foreground'
      )}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
    >
      <Icon size={24} />
    </button>
  )
}

export interface CarouselProps {
  children: React.ReactNode
  
  // Navigation
  showArrows?: boolean
  showDots?: boolean
  infinite?: boolean
  slidesToShow?: number
  slidesToScroll?: number
  
  // Autoplay
  autoplay?: boolean
  autoplaySpeed?: number
  pauseOnHover?: boolean
  pauseOnFocus?: boolean
  
  // Touch/Swipe
  swipeable?: boolean
  draggable?: boolean
  swipeThreshold?: number
  
  // Animation
  speed?: number
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  fade?: boolean
  vertical?: boolean
  
  // Responsive
  responsive?: Array<{
    breakpoint: number
    settings: Partial<CarouselProps>
  }>
  
  // Styling
  gap?: number
  centerMode?: boolean
  centerPadding?: string
  variableWidth?: boolean
  adaptiveHeight?: boolean
  
  // Events
  beforeChange?: (oldIndex: number, newIndex: number) => void
  afterChange?: (index: number) => void
  onSwipe?: (direction: 'left' | 'right') => void
  
  // Appearance
  theme?: keyof typeof themes
  variant?: 'default' | 'minimal' | 'cards' | 'testimonial'
  dotsPosition?: 'bottom' | 'top'
  arrowsPosition?: 'inside' | 'outside' | 'corner'
  className?: string
  slideClassName?: string
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  showArrows = true,
  showDots = true,
  infinite = true,
  slidesToShow = 1,
  slidesToScroll = 1,
  autoplay = false,
  autoplaySpeed = 3000,
  pauseOnHover = true,
  pauseOnFocus = true,
  swipeable = true,
  draggable = true,
  swipeThreshold = 50,
  speed = 500,
  easing = 'ease-in-out',
  fade = false,
  vertical = false,
  responsive = [],
  gap = 16,
  centerMode = false,
  centerPadding = '50px',
  variableWidth = false,
  adaptiveHeight = false,
  beforeChange,
  afterChange,
  onSwipe,
  theme = 'glass-aurora',
  variant = 'default',
  dotsPosition = 'bottom',
  arrowsPosition = 'inside',
  className,
  slideClassName,
}) => {
  const selectedTheme = themes[theme]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [slideHeight, setSlideHeight] = useState<number | 'auto'>('auto')

  // Callback ref for container - measures width on mount (avoids useEffect for initialization)
  const containerRef = useRef<HTMLDivElement>(null)
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node
    if (node) {
      setContainerWidth(node.offsetWidth)
    }
  }, [])
  const trackRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const slides = Children.toArray(children)
  const totalSlides = slides.length

  // Compute responsive settings during render using useSyncExternalStore
  const getActiveSettings = useCallback(() => {
    if (typeof window === 'undefined') return {}
    const width = window.innerWidth
    let computedSettings: Partial<CarouselProps> = {}

    responsive.forEach(({ breakpoint, settings: breakpointSettings }) => {
      if (width <= breakpoint) {
        computedSettings = { ...computedSettings, ...breakpointSettings }
      }
    })

    return computedSettings
  }, [responsive])

  const subscribeToResize = useCallback((callback: () => void) => {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }, [])

  const activeSettings = useSyncExternalStore<Partial<CarouselProps>>(
    subscribeToResize,
    getActiveSettings,
    () => ({}) // SSR fallback
  )

  // Merge settings with responsive overrides
  const settings = {
    slidesToShow: activeSettings.slidesToShow || slidesToShow,
    slidesToScroll: activeSettings.slidesToScroll || slidesToScroll,
    gap: activeSettings.gap ?? gap,
    // ... other settings
  }

  // Calculate dimensions
  const slideWidth = variableWidth ? 'auto' : `${100 / settings.slidesToShow}%`
  const maxIndex = Math.ceil((totalSlides - settings.slidesToShow) / settings.slidesToScroll)

  // Navigation functions - declared before effects that use them
  const goToSlide = useCallback((index: number) => {
    let newIndex = index

    if (!infinite) {
      newIndex = Math.max(0, Math.min(index, maxIndex))
    } else {
      if (index < 0) {
        newIndex = maxIndex
      } else if (index > maxIndex) {
        newIndex = 0
      }
    }

    beforeChange?.(currentIndex, newIndex)
    setCurrentIndex(newIndex)
    afterChange?.(newIndex)
  }, [currentIndex, infinite, maxIndex, beforeChange, afterChange])

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  const goToPrev = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  // Callback ref factory for slides - measures height when current slide's element is set
  const createSlideRef = useCallback((index: number) => (node: HTMLDivElement | null) => {
    slideRefs.current[index] = node
    // Measure height for adaptive height when current slide's element is set
    if (adaptiveHeight && index === currentIndex && node) {
      setSlideHeight(node.offsetHeight)
    }
  }, [adaptiveHeight, currentIndex])

  // Autoplay effect - now goToNext is defined before this
  useEffect(() => {
    if (!isPlaying || isPaused) return

    autoplayTimerRef.current = setTimeout(() => {
      goToNext()
    }, autoplaySpeed)

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }

  }, [currentIndex, isPlaying, isPaused, autoplaySpeed, goToNext])
  
  // Touch/Mouse handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeable && !draggable) return
    
    const position = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setTouchStart(position)
    setIsDragging(true)
  }
  
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return
    
    const currentPosition = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setTouchEnd(currentPosition)
    
    if (draggable) {
      const diff = touchStart - currentPosition
      setDragOffset(diff)
    }
  }
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > swipeThreshold
    const isRightSwipe = distance < -swipeThreshold
    
    if (isLeftSwipe) {
      goToNext()
      onSwipe?.('left')
    } else if (isRightSwipe) {
      goToPrev()
      onSwipe?.('right')
    }
    
    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
    setDragOffset(0)
  }
  
  // Calculate transform - uses containerWidth state, not ref
  const getTransform = () => {
    if (fade) return 'none'

    const baseOffset = currentIndex * settings.slidesToScroll * (100 / settings.slidesToShow)
    const dragOffsetPercent = isDragging && containerWidth > 0
      ? (dragOffset / containerWidth) * 100
      : 0

    if (vertical) {
      return `translateY(-${baseOffset + dragOffsetPercent}%)`
    }
    return `translateX(-${baseOffset + dragOffsetPercent}%)`
  }
  
  // Variant styles
  const variantStyles = {
    default: '',
    minimal: 'overflow-visible',
    cards: cn(
      'px-4',
      selectedTheme?.card,
      selectedTheme?.blur
    ),
    testimonial: 'py-8',
  }

  return (
    <div
      ref={setContainerRef}
      className={cn(
        'relative',
        variantStyles[variant],
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onFocus={() => pauseOnFocus && setIsPaused(true)}
      onBlur={() => pauseOnFocus && setIsPaused(false)}
    >
      {/* Slides container */}
      <div className={cn(
        'overflow-hidden',
        centerMode && 'overflow-visible'
      )}>
        <div
          ref={trackRef}
          className={cn(
            'flex',
            vertical && 'flex-col',
            !fade && 'transition-transform',
            isDragging && 'cursor-grabbing'
          )}
          style={{
            transform: getTransform(),
            transitionDuration: isDragging ? '0ms' : `${speed}ms`,
            transitionTimingFunction: easing,
            gap: `${gap}px`,
            height: adaptiveHeight ? slideHeight : 'auto',
            paddingLeft: centerMode ? centerPadding : 0,
            paddingRight: centerMode ? centerPadding : 0,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={draggable ? handleTouchStart : undefined}
          onMouseMove={isDragging ? handleTouchMove : undefined}
          onMouseUp={isDragging ? handleTouchEnd : undefined}
          onMouseLeave={isDragging ? handleTouchEnd : undefined}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              ref={createSlideRef(index)}
              className={cn(
                'flex-shrink-0',
                slideClassName,
                fade && index !== currentIndex && 'absolute opacity-0',
                fade && index === currentIndex && 'opacity-100',
                !isDragging && 'cursor-grab'
              )}
              style={{
                width: slideWidth,
                transition: fade ? `opacity ${speed}ms ${easing}` : undefined,
              }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      {showArrows && (
        <>
          <ArrowButton
            direction="prev"
            onClick={goToPrev}
            disabled={!infinite && currentIndex === 0}
            arrowsPosition={arrowsPosition}
          />
          <ArrowButton
            direction="next"
            onClick={goToNext}
            disabled={!infinite && currentIndex >= maxIndex}
            arrowsPosition={arrowsPosition}
          />
        </>
      )}
      
      {/* Dots indicator */}
      {showDots && (
        <div className={cn(
          'flex justify-center gap-2 mt-4',
          dotsPosition === 'top' && 'order-first mb-4 mt-0',
          dotsPosition === 'bottom' && 'order-last'
        )}>
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === currentIndex
                  ? 'w-8 bg-primary'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Play/Pause button for autoplay */}
      {autoplay && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            'absolute bottom-4 right-4 z-10',
            'p-2 rounded-full',
            'bg-white/10 backdrop-blur-md border border-white/20',
            'hover:bg-white/20 transition-colors'
          )}
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}
    </div>
  )
}

// Carousel Item wrapper for better control
export interface CarouselItemProps {
  children: React.ReactNode
  className?: string
}

export const CarouselItem: React.FC<CarouselItemProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  )
}

// Testimonial Carousel variant
export interface TestimonialCarouselProps {
  testimonials: Array<{
    id: string
    content: string
    author: string
    role?: string
    avatar?: string
    rating?: number
  }>
  theme?: keyof typeof themes
  className?: string
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  theme = 'glass-aurora',
  className,
}) => {
  const selectedTheme = themes[theme]
  
  return (
    <Carousel
      variant="testimonial"
      theme={theme}
      {...(className && { className })}
      autoplay
      pauseOnHover
    >
      {testimonials.map(testimonial => (
        <CarouselItem key={testimonial.id}>
          <div className={cn(
            'p-8 mx-4',
            'bg-white/5 backdrop-blur-md',
            'border border-white/10',
            'rounded-2xl',
            selectedTheme?.card
          )}>
            {/* Rating */}
            {testimonial.rating && (
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < (testimonial.rating ?? 0)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
            
            {/* Content */}
            <blockquote className={cn(
              typography.body.className,
              'mb-6 text-foreground/80'
            )}>
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center gap-3">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                {testimonial.role && (
                  <div className="text-sm text-foreground/60">{testimonial.role}</div>
                )}
              </div>
            </div>
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  )
}