import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Subscribe to viewport resize events via matchMedia.
 * Used by useSyncExternalStore to detect mobile breakpoint changes.
 *
 * @param callback - Callback invoked when viewport crosses mobile breakpoint
 * @returns Cleanup function to remove event listener
 */
function subscribeToViewport(callback: () => void): () => void {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

/**
 * Get current mobile state from window.
 * Used by useSyncExternalStore as the client snapshot.
 *
 * @returns true if viewport width is below mobile breakpoint
 */
function getSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * Server-side fallback for mobile detection.
 * Returns false as we cannot determine viewport on server.
 *
 * @returns false (conservative default for SSR)
 */
function getServerSnapshot(): boolean {
  return false
}

/**
 * React hook to detect if the current viewport is considered mobile.
 * Uses useSyncExternalStore for proper SSR hydration.
 *
 * Features:
 * - SSR-safe with proper hydration (no hydration mismatch)
 * - Subscribes to matchMedia changes for responsive updates
 * - Returns false during SSR, updates on client mount
 * - Returns boolean for easy conditionals
 *
 * @returns Boolean indicating if viewport width is below mobile breakpoint (768px)
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useIsMobile()
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileNavigation />
 *       ) : (
 *         <DesktopNavigation />
 *       )}
 *     </div>
 *   )
 * }
 *
 * // Conditional rendering for mobile-specific features
 * function App() {
 *   const isMobile = useIsMobile()
 *
 *   return (
 *     <div>
 *       <Header />
 *       {isMobile && <MobileOnlyFeature />}
 *       <MainContent />
 *     </div>
 *   )
 * }
 * ```
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeToViewport, getSnapshot, getServerSnapshot)
}
