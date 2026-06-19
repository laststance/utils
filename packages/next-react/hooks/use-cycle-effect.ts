import { useEffect, type EffectCallback, type DependencyList } from 'react'

/**
 * Standard React lifecycle effect — a 1:1 semantic alias of `useEffect` that
 * fires on mount and again whenever any value in `deps` changes.
 *
 * Use this when you want the same behavior as `useEffect` but a name that
 * makes the lifecycle intent obvious at the call site. It completes the set
 * of useEffect wrappers in this package:
 *   - `useInitialEffect`  → mount only (deps = `[]`)
 *   - `useUpdateEffect`   → every re-render only (skips mount)
 *   - `useUnmountEffect`  → unmount only
 *   - `useRenderEffect`   → every render, or mount + non-empty deps changes
 *   - `useCycleEffect`    → 1:1 alias of `useEffect` (this hook)
 *
 * Behavior is identical to the underlying `useEffect`:
 * - If `deps` is omitted, the effect fires on every render.
 * - If `deps` is `[]`, the effect fires only on mount.
 * - Otherwise the effect fires on mount and whenever any dep changes.
 *
 * @param effect - The effect callback. May return a cleanup function.
 * @param deps - Optional dependency list passed straight through to
 *   `useEffect`. Omit for "every render", pass `[]` for "mount only".
 *
 * @example
 * useCycleEffect(() => {
 *   document.title = `Count: ${count}`
 * }, [count])
 */
export const useCycleEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
): void => {
  // Pass deps straight through so consumers get the exact useEffect semantics.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, deps)
}
