import { useRef } from 'react'

/**
 * Returns `true` on the initial render, `false` on subsequent renders.
 * Uses useSyncExternalStore with a ref to avoid triggering cascading renders.
 */
export function useIsInitialRender(): boolean {
  const mounted = useRef<boolean | null>(null)
  if (mounted.current === null) {
    mounted.current = true
    return true
  }
  return false
}
