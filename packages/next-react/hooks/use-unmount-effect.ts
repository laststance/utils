import { useEffect, useEffectEvent } from 'react'

/**
 * Run a callback only when the component unmounts.
 *
 * The callback is wrapped in React's Effect Event API so the cleanup phase
 * calls the latest callback even if props or state changed after mount.
 *
 * @param callback - Teardown work to run during unmount.
 * @returns Nothing; React invokes `callback` from the cleanup phase.
 *
 * @example
 * useUnmountEffect(() => {
 *   window.clearTimeout(timerId)
 * })
 */
export function useUnmountEffect(callback: () => void): void {
  const onUnmount = useEffectEvent(callback)

  useEffect(() => {
    return () => onUnmount()
  }, [])
}
