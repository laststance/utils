import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Subscribe to window matchMedia changes for mobile breakpoint.
 * @param callback - The callback to invoke when media query changes.
 * @returns A cleanup function to unsubscribe.
 */
function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

/**
 * Get the current mobile state.
 * @returns true if window width is below mobile breakpoint, false otherwise.
 */
function getSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * SSR fallback for mobile state.
 * @returns false since there is no window on the server.
 */
function getServerSnapshot(): boolean {
  return false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
