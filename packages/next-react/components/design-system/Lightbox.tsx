'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { themes } from '@/lib/design-system/themes'
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Share2,
  Play,
  Pause,
  Grid3x3,
  Loader2
} from 'lucide-react'
import { Button } from './Button'

export interface MediaItem {
  id: string
  src: string
  thumbnail?: string
  title?: string
  description?: string
  type?: 'image' | 'video'
  width?: number
  height?: number
  alt?: string
  meta?: Record<string, any>
}

export interface LightboxProps {
  items: MediaItem[]
  isOpen: boolean
  onClose: () => void
  currentIndex?: number
  onIndexChange?: (index: number) => void
  
  // Features
  showThumbnails?: boolean
  showCaption?: boolean
  showToolbar?: boolean
  enableZoom?: boolean
  enableDownload?: boolean
  enableShare?: boolean
  enableFullscreen?: boolean
  enableSlideshow?: boolean
  slideshowInterval?: number
  
  // Navigation
  infinite?: boolean
  swipeable?: boolean
  keyboard?: boolean
  
  // Animations
  animationType?: 'fade' | 'slide' | 'zoom'
  animationDuration?: number
  
  // Styling
  theme?: keyof typeof themes
  overlayOpacity?: number
  className?: string
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  isOpen,
  onClose,
  currentIndex: controlledIndex = 0,
  onIndexChange,
  showThumbnails = true,
  showCaption = true,
  showToolbar = true,
  enableZoom = true,
  enableDownload = false,
  enableShare = false,
  enableFullscreen = true,
  enableSlideshow = false,
  slideshowInterval = 3000,
  infinite = true,
  swipeable = true,
  keyboard = true,
  animationType = 'slide',
  overlayOpacity = 0.9,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(controlledIndex)
  const [zoom, setZoom] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [, setIsFullscreen] = useState(false)
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const currentItem = items[currentIndex]
  
  // Update internal index when controlled index changes
  useEffect(() => {
    setCurrentIndex(controlledIndex)
  }, [controlledIndex])
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !keyboard) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          navigatePrev()
          break
        case 'ArrowRight':
          navigateNext()
          break
        case '+':
        case '=':
          if (enableZoom) handleZoomIn()
          break
        case '-':
        case '_':
          if (enableZoom) handleZoomOut()
          break
        case ' ':
          e.preventDefault()
          if (enableSlideshow) toggleSlideshow()
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
     
  }, [isOpen, currentIndex, keyboard, enableZoom, enableSlideshow])
  
  // Handle slideshow
  useEffect(() => {
    if (!isPlaying || !enableSlideshow) return
    
    slideshowTimerRef.current = setTimeout(() => {
      navigateNext()
    }, slideshowInterval)
    
    return () => {
      if (slideshowTimerRef.current) {
        clearTimeout(slideshowTimerRef.current)
      }
    }
     
  }, [isPlaying, currentIndex, enableSlideshow, slideshowInterval])
  
  // Navigation functions
  const navigateNext = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= items.length) {
      if (infinite) {
        setCurrentIndex(0)
        onIndexChange?.(0)
      }
    } else {
      setCurrentIndex(nextIndex)
      onIndexChange?.(nextIndex)
    }
    setZoom(1)
    setDragOffset({ x: 0, y: 0 })
  }, [currentIndex, items.length, infinite, onIndexChange])
  
  const navigatePrev = useCallback(() => {
    const prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      if (infinite) {
        setCurrentIndex(items.length - 1)
        onIndexChange?.(items.length - 1)
      }
    } else {
      setCurrentIndex(prevIndex)
      onIndexChange?.(prevIndex)
    }
    setZoom(1)
    setDragOffset({ x: 0, y: 0 })
  }, [currentIndex, items.length, infinite, onIndexChange])
  
  const navigateToIndex = (index: number) => {
    setCurrentIndex(index)
    onIndexChange?.(index)
    setZoom(1)
    setDragOffset({ x: 0, y: 0 })
    setShowThumbnailGrid(false)
  }
  
  // Zoom functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 4))
  }
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5))
  }
  
  const handleZoomReset = () => {
    setZoom(1)
    setDragOffset({ x: 0, y: 0 })
  }
  
  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  // Slideshow
  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying)
  }
  
  // Download
  const handleDownload = () => {
    if (!currentItem) return
    
    const link = document.createElement('a')
    link.href = currentItem.src
    link.download = currentItem.title || `media-${currentIndex}`
    link.click()
  }
  
  // Share
  const handleShare = async () => {
    if (!currentItem) return
    
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: currentItem.title || '',
          text: currentItem.description || '',
          url: currentItem.src,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    }
  }
  
  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeable || !e.touches[0]) return
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeable || !touchStart || !e.touches[0]) return
    
    const deltaX = e.touches[0].clientX - touchStart.x
    const deltaY = e.touches[0].clientY - touchStart.y
    
    if (zoom > 1) {
      setDragOffset({ x: deltaX, y: deltaY })
    }
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeable || !touchStart || !e.changedTouches[0]) return
    
    const deltaX = e.changedTouches[0].clientX - touchStart.x
    const threshold = 50
    
    if (zoom === 1) {
      if (deltaX > threshold) {
        navigatePrev()
      } else if (deltaX < -threshold) {
        navigateNext()
      }
    }
    
    setTouchStart(null)
  }
  
  if (!isOpen) return null
  
  // Animation classes
  const animationClasses = {
    fade: 'animate-in fade-in duration-300',
    slide: 'animate-in slide-in-from-bottom duration-300',
    zoom: 'animate-in zoom-in-95 duration-300',
  }
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-50',
        'flex flex-col',
        animationClasses[animationType],
        className
      )}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
        onClick={onClose}
      />
      
      {/* Toolbar */}
      {showToolbar && (
        <div className="relative z-10 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {/* Counter */}
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm">
              {currentIndex + 1} / {items.length}
            </div>
            
            {/* Title */}
            {currentItem?.title && (
              <div className="px-3 py-1 text-white text-sm font-medium">
                {currentItem.title}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            {enableZoom && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="text-white hover:bg-white/10"
                >
                  <ZoomOut size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomReset}
                  className="text-white hover:bg-white/10"
                >
                  {Math.round(zoom * 100)}%
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="text-white hover:bg-white/10"
                >
                  <ZoomIn size={20} />
                </Button>
              </>
            )}
            
            {/* Slideshow */}
            {enableSlideshow && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSlideshow}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
            )}
            
            {/* Grid view */}
            {showThumbnails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThumbnailGrid(!showThumbnailGrid)}
                className="text-white hover:bg-white/10"
              >
                <Grid3x3 size={20} />
              </Button>
            )}
            
            {/* Download */}
            {enableDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/10"
              >
                <Download size={20} />
              </Button>
            )}
            
            {/* Share */}
            {enableShare && typeof navigator.share === 'function' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/10"
              >
                <Share2 size={20} />
              </Button>
            )}
            
            {/* Fullscreen */}
            {enableFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/10"
              >
                <Maximize2 size={20} />
              </Button>
            )}
            
            {/* Close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Previous button */}
        <button
          onClick={navigatePrev}
          className={cn(
            'absolute left-4 z-10',
            'p-3 rounded-full',
            'bg-white/10 backdrop-blur-md',
            'hover:bg-white/20 transition-colors',
            'text-white',
            (!infinite && currentIndex === 0) && 'opacity-50 cursor-not-allowed'
          )}
          disabled={!infinite && currentIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Media display */}
        <div
          className="relative max-w-full max-h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `scale(${zoom}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
            transition: touchStart ? 'none' : 'transform 200ms',
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
          
          {currentItem?.type === 'video' ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={currentItem.src}
              controls
              className="max-w-full max-h-full"
              onLoadedData={() => setIsLoading(false)}
            />
          ) : (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={currentItem?.src}
              alt={currentItem?.alt || currentItem?.title}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
        </div>
        
        {/* Next button */}
        <button
          onClick={navigateNext}
          className={cn(
            'absolute right-4 z-10',
            'p-3 rounded-full',
            'bg-white/10 backdrop-blur-md',
            'hover:bg-white/20 transition-colors',
            'text-white',
            (!infinite && currentIndex === items.length - 1) && 'opacity-50 cursor-not-allowed'
          )}
          disabled={!infinite && currentIndex === items.length - 1}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Caption */}
      {showCaption && currentItem?.description && (
        <div className="relative z-10 p-4 text-center">
          <p className="text-white/80 text-sm max-w-2xl mx-auto">
            {currentItem.description}
          </p>
        </div>
      )}
      
      {/* Thumbnails */}
      {showThumbnails && !showThumbnailGrid && (
        <div className="relative z-10 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => navigateToIndex(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden',
                  'border-2 transition-all',
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img
                  src={item.thumbnail || item.src}
                  alt={item.alt || item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Thumbnail grid */}
      {showThumbnailGrid && (
        <div className="absolute inset-0 z-20 bg-black/95 overflow-auto p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => navigateToIndex(index)}
                className={cn(
                  'aspect-square rounded-lg overflow-hidden',
                  'border-2 transition-all',
                  'hover:scale-105',
                  index === currentIndex
                    ? 'border-white'
                    : 'border-transparent'
                )}
              >
                <img
                  src={item.thumbnail || item.src}
                  alt={item.alt || item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Image Gallery Component
export interface ImageGalleryProps {
  images: MediaItem[]
  columns?: number
  gap?: number
  rounded?: boolean
  showTitle?: boolean
  onClick?: (item: MediaItem, index: number) => void
  className?: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 4,
  rounded = true,
  showTitle = false,
  onClick,
  className,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
    const image = images[index]
    if (image) {
      onClick?.(image, index)
    }
  }
  
  return (
    <>
      <div
        className={cn(
          'grid',
          `grid-cols-${columns}`,
          `gap-${gap}`,
          className
        )}
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleImageClick(index)}
            className={cn(
              'relative overflow-hidden group',
              'aspect-square',
              rounded && 'rounded-lg',
              'hover:scale-105 transition-transform'
            )}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt || image.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            
            {/* Title */}
            {showTitle && image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">
                  {image.title}
                </p>
              </div>
            )}
            
            {/* Zoom icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </button>
        ))}
      </div>
      
      <Lightbox
        items={images}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
    </>
  )
}