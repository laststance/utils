'use client'

import type React from 'react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'

export interface PageProgressProps {
  isLoading?: boolean
  color?: string
  height?: number
  showSpinner?: boolean
  spinnerPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  trickleSpeed?: number
  minimum?: number
  easing?: string
  speed?: number
  template?: string
  zIndex?: number
  parent?: string
  className?: string
}

export class PageProgress {
  private static instance: PageProgress | null = null
  private progress: number = 0
  private status: 'idle' | 'loading' | 'done' = 'idle'
  private trickleTimer: NodeJS.Timeout | null = null
  private settings: Required<PageProgressProps>
  private barElement: HTMLDivElement | null = null
  
  constructor(props: PageProgressProps = {}) {
    this.settings = {
      isLoading: false,
      color: '#3b82f6',
      height: 3,
      showSpinner: true,
      spinnerPosition: 'top-right',
      trickleSpeed: 200,
      minimum: 0.08,
      easing: 'ease',
      speed: 200,
      template: '',
      zIndex: 9999,
      parent: 'body',
      className: '',
    }
    
    this.configure(props)
  }
  
  static getInstance(props?: PageProgressProps): PageProgress {
    if (!PageProgress.instance) {
      PageProgress.instance = new PageProgress(props)
    }
    return PageProgress.instance
  }
  
  configure(props: PageProgressProps) {
    this.settings = { ...this.settings, ...props }
  }
  
  start() {
    if (this.status === 'loading') return this
    
    this.status = 'loading'
    this.render()
    this.set(this.settings.minimum)
    this.trickle()
    
    return this
  }
  
  done() {
    if (this.status === 'idle') return this
    
    this.inc(0.3 + 0.5 * Math.random())
    this.set(1)
    
    setTimeout(() => {
      this.hide()
      this.status = 'idle'
      this.progress = 0
    }, this.settings.speed)
    
    return this
  }
  
  set(n: number) {
    n = Math.max(this.settings.minimum, Math.min(1, n))
    this.progress = n
    
    if (this.barElement) {
      this.barElement.style.transform = `translate3d(${-100 + n * 100}%, 0, 0)`
      this.barElement.style.transition = `transform ${this.settings.speed}ms ${this.settings.easing}`
    }
    
    if (n === 1) {
      if (this.trickleTimer) {
        clearTimeout(this.trickleTimer)
        this.trickleTimer = null
      }
    }
    
    return this
  }
  
  inc(amount?: number) {
    let n = this.progress
    
    if (!amount) {
      if (n < 0.2) amount = 0.1
      else if (n < 0.5) amount = 0.04
      else if (n < 0.8) amount = 0.02
      else if (n < 0.99) amount = 0.005
      else amount = 0
    }
    
    n = Math.min(n + amount, 0.994)
    return this.set(n)
  }
  
  trickle() {
    this.trickleTimer = setTimeout(() => {
      this.inc()
      if (this.status === 'loading') {
        this.trickle()
      }
    }, this.settings.trickleSpeed)
  }
  
  render() {
    if (this.barElement) return
    
    const parent = document.querySelector(this.settings.parent)
    if (!parent) return
    
    // Create container
    const container = document.createElement('div')
    container.id = 'page-progress'
    container.className = this.settings.className
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: ${this.settings.zIndex};
      pointer-events: none;
    `
    
    // Create bar
    const bar = document.createElement('div')
    bar.className = 'page-progress-bar'
    bar.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: ${this.settings.height}px;
      background: ${this.settings.color};
      transform: translate3d(-100%, 0, 0);
      transition: transform ${this.settings.speed}ms ${this.settings.easing};
      box-shadow: 0 0 10px ${this.settings.color}, 0 0 5px ${this.settings.color};
    `
    
    // Create peg (leading edge glow)
    const peg = document.createElement('div')
    peg.className = 'page-progress-peg'
    peg.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${this.settings.color}, 0 0 5px ${this.settings.color};
      opacity: 1;
      transform: rotate(3deg) translate(0, -4px);
    `
    
    bar.appendChild(peg)
    container.appendChild(bar)
    
    // Create spinner if enabled
    if (this.settings.showSpinner) {
      const spinner = document.createElement('div')
      spinner.className = 'page-progress-spinner'
      
      const positions = {
        'top-left': 'top: 15px; left: 15px;',
        'top-right': 'top: 15px; right: 15px;',
        'bottom-left': 'bottom: 15px; left: 15px;',
        'bottom-right': 'bottom: 15px; right: 15px;',
      }
      
      spinner.style.cssText = `
        position: fixed;
        ${positions[this.settings.spinnerPosition]}
        z-index: ${this.settings.zIndex};
      `
      
      const spinnerIcon = document.createElement('div')
      spinnerIcon.style.cssText = `
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        border: 2px solid transparent;
        border-top-color: ${this.settings.color};
        border-left-color: ${this.settings.color};
        border-radius: 50%;
        animation: page-progress-spinner 400ms linear infinite;
      `
      
      spinner.appendChild(spinnerIcon)
      container.appendChild(spinner)
      // Spinner element created
    }
    
    // Add styles
    if (!document.querySelector('#page-progress-styles')) {
      const style = document.createElement('style')
      style.id = 'page-progress-styles'
      style.textContent = `
        @keyframes page-progress-spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        #page-progress .page-progress-bar {
          will-change: transform;
        }
      `
      document.head.appendChild(style)
    }
    
    parent.appendChild(container)
    this.barElement = bar
  }
  
  hide() {
    const container = document.querySelector('#page-progress')
    if (container) {
      container.remove()
    }
    this.barElement = null
  }
  
  isStarted() {
    return this.status === 'loading'
  }
}

// React Hook
export function usePageProgress(props?: PageProgressProps) {
  const progressRef = useRef<PageProgress | null>(null)

  // Memoize props to create a stable reference for the effect
  const {
    color,
    height,
    showSpinner,
    spinnerPosition,
    trickleSpeed,
    minimum,
    easing,
    speed,
    template,
    zIndex,
    parent,
    className,
  } = props ?? {}

  useEffect(() => {
    // Build config object, only including defined values to satisfy exactOptionalPropertyTypes
    const config: PageProgressProps = {}
    if (color !== undefined) config.color = color
    if (height !== undefined) config.height = height
    if (showSpinner !== undefined) config.showSpinner = showSpinner
    if (spinnerPosition !== undefined) config.spinnerPosition = spinnerPosition
    if (trickleSpeed !== undefined) config.trickleSpeed = trickleSpeed
    if (minimum !== undefined) config.minimum = minimum
    if (easing !== undefined) config.easing = easing
    if (speed !== undefined) config.speed = speed
    if (template !== undefined) config.template = template
    if (zIndex !== undefined) config.zIndex = zIndex
    if (parent !== undefined) config.parent = parent
    if (className !== undefined) config.className = className

    progressRef.current = PageProgress.getInstance(config)

    return () => {
      if (progressRef.current?.isStarted()) {
        progressRef.current.done()
      }
    }
  }, [color, height, showSpinner, spinnerPosition, trickleSpeed, minimum, easing, speed, template, zIndex, parent, className])

  const start = useCallback(() => progressRef.current?.start(), [])
  const done = useCallback(() => progressRef.current?.done(), [])
  const set = useCallback((n: number) => progressRef.current?.set(n), [])
  const inc = useCallback((amount?: number) => progressRef.current?.inc(amount), [])
  const configure = useCallback((configProps: PageProgressProps) => progressRef.current?.configure(configProps), [])
  const isStarted = useCallback(() => progressRef.current?.isStarted() || false, [])

  return useMemo(() => ({
    start,
    done,
    set,
    inc,
    configure,
    isStarted,
  }), [start, done, set, inc, configure, isStarted])
}

// React Component
export const PageProgressBar: React.FC<PageProgressProps & {
  onStart?: () => void
  onDone?: () => void
}> = ({
  isLoading = false,
  onStart,
  onDone,
  ...props
}) => {
  const progress = usePageProgress(props)

  // Memoize callbacks to prevent unnecessary effect re-runs
  const handleStart = useCallback(() => {
    progress.start()
    onStart?.()
  }, [progress, onStart])

  const handleDone = useCallback(() => {
    progress.done()
    onDone?.()
  }, [progress, onDone])

  // Note: The lint warnings about "passing refs to parents" are false positives.
  // We're calling methods from a hook-returned object, not passing refs.
  /* eslint-disable react-you-might-not-need-an-effect/no-pass-ref-to-parent */
  useEffect(() => {
    if (isLoading) {
      handleStart()
    } else {
      handleDone()
    }
  }, [isLoading, handleStart, handleDone])
  /* eslint-enable react-you-might-not-need-an-effect/no-pass-ref-to-parent */

  return null
}

// Next.js Router Integration Hook
export function useRouterProgress(props?: PageProgressProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const progress = usePageProgress(props)

  // Store progress methods in refs to avoid re-triggering the effect
  const progressRef = useRef(progress)
  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    // This would integrate with Next.js router events
    // For now, it's a placeholder that can be extended
    const handleStart = () => {
      setIsNavigating(true)
      progressRef.current.start()
    }

    const handleComplete = () => {
      setIsNavigating(false)
      progressRef.current.done()
    }

    // Listen for route changes (Next.js specific)
    if (typeof window !== 'undefined') {
      // Detect navigation using Navigation API if available
      if ('navigation' in window) {
        (window as unknown as { navigation: EventTarget }).navigation.addEventListener('navigate', handleStart);
        (window as unknown as { navigation: EventTarget }).navigation.addEventListener('navigatesuccess', handleComplete);
        (window as unknown as { navigation: EventTarget }).navigation.addEventListener('navigateerror', handleComplete);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'navigation' in window) {
        (window as unknown as { navigation: EventTarget }).navigation.removeEventListener('navigate', handleStart);
        (window as unknown as { navigation: EventTarget }).navigation.removeEventListener('navigatesuccess', handleComplete);
        (window as unknown as { navigation: EventTarget }).navigation.removeEventListener('navigateerror', handleComplete);
      }
    }
  }, [])

  return { isNavigating, progress }
}

// Standalone functions for manual control
export const startProgress = (props?: PageProgressProps) => {
  PageProgress.getInstance(props).start()
}

export const doneProgress = () => {
  PageProgress.getInstance().done()
}

export const setProgress = (n: number) => {
  PageProgress.getInstance().set(n)
}

export const incProgress = (amount?: number) => {
  PageProgress.getInstance().inc(amount)
}

export const configureProgress = (props: PageProgressProps) => {
  PageProgress.getInstance().configure(props)
}