import { useSyncExternalStore } from 'react'

/**
 * Empty subscribe function for useSyncExternalStore.
 * No subscription is needed since mounted state never changes after initial render.
 * @returns Cleanup function (no-op)
 */
const emptySubscribe = () => () => {}

/**
 * Client snapshot: Always returns true (component is mounted on client).
 * @returns true
 */
const getClientSnapshot = () => true

/**
 * Server snapshot: Always returns false (component is not mounted during SSR).
 * @returns false
 */
const getServerSnapshot = () => false

/**
 * SSR-safe hook to detect if component is mounted on client.
 *
 * Uses useSyncExternalStore to provide different values during SSR (false)
 * and client render (true), preventing hydration mismatch warnings.
 *
 * This pattern is recommended by React team for client-only rendering:
 * - Server: Returns false (getServerSnapshot)
 * - Client: Returns true (getClientSnapshot)
 * - No re-render cascade (unlike useState + useEffect pattern)
 *
 * @returns true if mounted on client, false during SSR
 * @example
 * const isMounted = useMounted()
 * if (!isMounted) return null // or skeleton
 * return <ClientOnlyComponent />
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
}
