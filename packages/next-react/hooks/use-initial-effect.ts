import { useEffect, type EffectCallback } from 'react'

/**
 * Run a React effect exactly once after the component mounts.
 *
 * Use this for mount-only setup such as one-time subscriptions, probes, or
 * bootstrapping code. For effects that should run again after later renders,
 * use `useUpdateEffect`, `useRenderEffect`, or `useCycleEffect`.
 *
 * @param effect - Work to run after the initial mount. May return cleanup.
 * @returns Nothing; React owns the optional cleanup returned by `effect`.
 *
 * @example
 * useInitialEffect(() => {
 *   analytics.track('viewed-dashboard')
 * })
 */
export const useInitialEffect = (effect: EffectCallback): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
