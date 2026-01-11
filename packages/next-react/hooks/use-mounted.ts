import { useSyncExternalStore } from 'react'

/**
 * Creates a store for tracking mount state (SSR-safe).
 * @returns
 * - Store interface compatible with useSyncExternalStore
 * @example
 * const store = createMountStore()
 * store.getSnapshot()
 */
function createMountStore() {
  let isMounted = false
  const listeners = new Set<() => void>()

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      // Set mounted on first subscription (client-side only)
      if (!isMounted && typeof window !== 'undefined') {
        isMounted = true
        // Notify after microtask to avoid setState during render
        queueMicrotask(() => listeners.forEach((l) => l()))
      }
      return () => listeners.delete(listener)
    },
    getSnapshot: () => isMounted,
    getServerSnapshot: () => false,
  }
}

// Singleton mount store to avoid recreation
const mountStore = createMountStore()
export function useMounted(): boolean {
  return useSyncExternalStore(
    mountStore.subscribe,
    mountStore.getSnapshot,
    mountStore.getServerSnapshot,
  )
}
