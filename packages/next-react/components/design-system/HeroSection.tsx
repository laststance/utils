'use client'

import {
  ArrowRight,
  Play,
  ChevronDown
} from 'lucide-react'
import React, { useEffect, useState, useRef, useSyncExternalStore, useCallback } from 'react'

import { shadows } from '@/lib/design-system/spacing'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

import { Button } from './Button'

/**
 * Custom hook for intersection observer visibility using useSyncExternalStore.
 * Properly handles SSR hydration by returning true on server (content visible by default).
 * @param ref - React ref to the element to observe
 * @param threshold - IntersectionObserver threshold (default 0.1)
 * @returns Whether the element is currently intersecting (visible)
 */
function useIntersectionVisibility(
  ref: React.RefObject<HTMLElement | null>,
  threshold = 0.1
): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const element = ref.current
      if (!element) return () => {}

      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          // Once visible, we can disconnect - animation triggers once
          observer.disconnect()
        }
        callback()
      }, { threshold })

      observer.observe(element)
      return () => observer.disconnect()
    },
    [ref, threshold]
  )

  const getSnapshot = useCallback(() => {
    const element = ref.current
    if (!element) return true // Default to visible if no element

    // Check if element is in viewport
    const rect = element.getBoundingClientRect()
    const isVisible =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0

    return isVisible
  }, [ref])

  // SSR fallback: assume visible to avoid flash of un-animated content
  const getServerSnapshot = useCallback(() => true, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export interface HeroSectionProps {
  // Content
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  description?: string | React.ReactNode
  
  // Actions
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  
  // Media
  backgroundImage?: string
  backgroundVideo?: string
  foregroundImage?: string
  overlay?: boolean
  overlayOpacity?: number
  
  // Parallax
  parallax?: boolean
  parallaxSpeed?: number
  parallaxOffset?: number
  
  // Animations
  animated?: boolean
  animationDelay?: number
  floatingElements?: React.ReactNode[]
  
  // Layout
  height?: 'full' | 'large' | 'medium' | 'small' | 'auto'
  alignment?: 'left' | 'center' | 'right'
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full'
  
  // Features
  stats?: Array<{ label: string; value: string | number }>
  badges?: Array<{ text: string; icon?: React.ReactNode }>
  scrollIndicator?: boolean
  onScrollClick?: () => void
  
  // Styling
  theme?: keyof typeof themes
  variant?: 'default' | 'gradient' | 'glass' | 'dark' | 'light'
  className?: string
  contentClassName?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  backgroundVideo,
  foregroundImage,
  overlay = true,
  overlayOpacity = 0.5,
  parallax = false,
  parallaxSpeed = 0.5,
  parallaxOffset = 0,
  animated = true,
  animationDelay = 100,
  floatingElements = [],
  height = 'large',
  alignment = 'center',
  contentWidth = 'medium',
  stats,
  badges,
  scrollIndicator = false,
  onScrollClick,
  theme = 'glass-aurora',
  variant = 'default',
  className,
  contentClassName,
}) => {
  const selectedTheme = themes[theme]
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Use useSyncExternalStore for intersection visibility (SSR-safe)
  const isVisible = useIntersectionVisibility(heroRef)
  
  // Height classes
  const heightClasses = {
    full: 'min-h-screen',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]',
    small: 'min-h-[40vh]',
    auto: 'min-h-[400px]',
  }
  
  // Alignment classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }
  
  // Content width classes
  const contentWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
  }
  
  // Variant styles
  const variantStyles = {
    default: '',
    gradient: 'bg-gradient-to-br from-primary/20 via-transparent to-secondary/20',
    glass: cn(selectedTheme?.card, selectedTheme?.blur),
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900',
  }
  
  // Handle parallax scrolling
  useEffect(() => {
    if (!parallax) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      setScrollY(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallax])
  
  // Calculate parallax transform
  const parallaxTransform = parallax 
    ? `translateY(${(scrollY * parallaxSpeed) + parallaxOffset}px)`
    : undefined
  
  return (
    <section
      ref={heroRef}
      className={cn(
        'relative overflow-hidden',
        heightClasses[height],
        'flex items-center',
        variantStyles[variant],
        className
      )}
    >
      {/* Background Video */}
      {backgroundVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: parallaxTransform }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Background Image */}
      {backgroundImage && !backgroundVideo && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: parallaxTransform,
          }}
        />
      )}
      
      {/* Overlay */}
      {overlay && (backgroundImage || backgroundVideo) && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={cn(
            'absolute',
            animated && 'animate-float'
          )}
          style={{
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + index}s`,
            top: `${20 + (index * 15)}%`,
            left: `${10 + (index * 20)}%`,
            transform: parallax ? `translateY(${scrollY * (0.3 + index * 0.1)}px)` : undefined,
          }}
        >
          {element}
        </div>
      ))}
      
      {/* Content Container */}
      <div className={cn(
        'relative z-10 w-full px-4 sm:px-6 lg:px-8',
        contentClassName
      )}>
        <div className={cn(
          'mx-auto',
          contentWidthClasses[contentWidth],
          alignmentClasses[alignment]
        )}>
          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className={cn(
              'flex flex-wrap gap-2 mb-6',
              alignment === 'center' && 'justify-center',
              alignment === 'right' && 'justify-end',
              animated && isVisible && 'animate-in fade-in slide-in-from-bottom-4',
              `animation-delay-${animationDelay}`
            )}>
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5',
                    'bg-white/10 backdrop-blur-md rounded-full',
                    'border border-white/20',
                    'text-sm font-medium'
                  )}
                >
                  {badge.icon}
                  {badge.text}
                </div>
              ))}
            </div>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <div className={cn(
              typography.headline.className,
              'mb-4 text-primary',
              animated && isVisible && 'animate-in fade-in slide-in-from-bottom-4',
              `animation-delay-${animationDelay + 100}`
            )}>
              {subtitle}
            </div>
          )}
          
          {/* Title */}
          <h1 className={cn(
            'mb-6',
            animated && isVisible && 'animate-in fade-in slide-in-from-bottom-4',
            `animation-delay-${animationDelay + 200}`
          )}>
            {typeof title === 'string' ? (
              <span className={cn(
                typography.largeTitle.className,
                'font-bold bg-clip-text text-transparent',
                'bg-gradient-to-r from-foreground to-foreground/70'
              )}>
                {title}
              </span>
            ) : (
              title
            )}
          </h1>
          
          {/* Description */}
          {description && (
            <div className={cn(
              typography.body.className,
              'mb-8 text-foreground/70',
              contentWidth === 'narrow' ? 'max-w-xl' : 'max-w-2xl',
              alignment === 'center' && 'mx-auto',
              alignment === 'right' && 'ml-auto',
              animated && isVisible && 'animate-in fade-in slide-in-from-bottom-4',
              `animation-delay-${animationDelay + 300}`
            )}>
              {description}
            </div>
          )}
          
          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className={cn(
              'flex flex-wrap gap-4 mb-12',
              alignment === 'center' && 'justify-center',
              alignment === 'right' && 'justify-end',
              animated && isVisible && 'animate-in fade-in slide-in-from-bottom-4',
              `animation-delay-${animationDelay + 400}`
            )}>
              {primaryAction && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="group"
                >
                  {primaryAction.label}
                  {primaryAction.icon || (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  theme={theme}
                >
                  {secondaryAction.icon || <Play className="mr-2 w-5 h-5" />}
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
          
          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className={cn(
              'grid grid-cols-2 md:grid-cols-4 gap-8',
              animated && isVisible && 'animate-in fade-in slide-in-from-bottom-4',
              `animation-delay-${animationDelay + 500}`
            )}>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    'text-center',
                    alignment === 'left' && 'text-left',
                    alignment === 'right' && 'text-right'
                  )}
                >
                  <div className={cn(
                    typography.title1.className,
                    'font-bold text-primary mb-1'
                  )}>
                    {stat.value}
                  </div>
                  <div className={cn(
                    typography.caption1.className,
                    'text-foreground/60'
                  )}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Foreground Image */}
          {foregroundImage && (
            <div className={cn(
              'relative mt-12',
              animated && isVisible && 'animate-in fade-in zoom-in-95',
              `animation-delay-${animationDelay + 600}`
            )}>
              <img
                src={foregroundImage}
                alt="Hero"
                className={cn(
                  'w-full h-auto rounded-2xl',
                  shadows.xl,
                  parallax && 'will-change-transform'
                )}
                style={{
                  transform: parallax ? `translateY(${scrollY * -0.2}px)` : undefined,
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      {scrollIndicator && (
        <button
          onClick={onScrollClick}
          className={cn(
            'absolute bottom-8 left-1/2 -translate-x-1/2',
            'p-2 rounded-full',
            'bg-white/10 backdrop-blur-md border border-white/20',
            'hover:bg-white/20 transition-colors',
            'animate-bounce'
          )}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}
    </section>
  )
}

// Additional hero variations
export const GradientHero: React.FC<Omit<HeroSectionProps, 'variant'>> = (props) => (
  <HeroSection {...props} variant="gradient" />
)

export const VideoHero: React.FC<Omit<HeroSectionProps, 'backgroundVideo'> & { videoUrl: string }> = ({
  videoUrl,
  ...props
}) => (
  <HeroSection {...props} backgroundVideo={videoUrl} />
)

export const ParallaxHero: React.FC<Omit<HeroSectionProps, 'parallax'>> = (props) => (
  <HeroSection {...props} parallax={true} />
)