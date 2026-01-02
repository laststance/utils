import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  className?: string
}

export function LoadingOverlay({
  isLoading,
  text = 'Please wait...',
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-busy="true"
      aria-label="Loading content"
      role="status"
    >
      <div
        className={cn(
          'flex flex-col items-center space-y-4 text-center',
          className,
        )}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        {text && <p className="text-lg font-medium">{text}</p>}
      </div>
    </div>
  )
}
