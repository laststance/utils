import {
  useEffect,
  useEffectEvent,
  useRef,
  type DependencyList,
  type EffectCallback,
} from 'react'

/**
 * Dependency list variant that rejects an empty array at compile time.
 */
type NonEmptyDependencyList = readonly [unknown, ...unknown[]]

/**
 * Run a React effect after re-renders while skipping the initial mount.
 *
 * Use this when state is already initialized during render but still needs to
 * respond to later dependency changes. Omit `deps` to run after every
 * post-mount re-render, or pass a non-empty list to run after those values
 * change. Passing `[]` is intentionally rejected; use `useInitialEffect` for
 * mount-only work.
 *
 * @param effect - Work to run after a post-mount render. May return cleanup.
 * @param deps - Optional non-empty dependency list that gates re-runs.
 * @returns Nothing; React owns the optional cleanup returned by `effect`.
 *
 * @example
 * useUpdateEffect(() => {
 *   setDraft(serverValue)
 * }, [serverValue])
 */
export function useUpdateEffect(effect: EffectCallback, deps?: undefined): void
export function useUpdateEffect(
  effect: EffectCallback,
  deps: NonEmptyDependencyList,
): void
export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const hasMountedRef = useRef(false)
  const onUpdate = useEffectEvent(effect)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return undefined
    }

    // Once mounted, mirror standard useEffect cleanup semantics.
    return onUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This wrapper intentionally forwards the caller-provided dependency list.
  }, deps)
}

export default useUpdateEffect
