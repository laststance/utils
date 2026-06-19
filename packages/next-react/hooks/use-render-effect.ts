import { useEffect, type EffectCallback, type DependencyList } from 'react'

/**
 * A dependency list with at least one element.
 *
 * `useRenderEffect` accepts either no deps (fires every render) or this
 * non-empty deps tuple. An empty `[]` is intentionally rejected at the type
 * level because a "mount-only" effect is the job of `useInitialEffect`, not
 * `useRenderEffect`.
 */
type NonEmptyDependencyList = readonly [unknown, ...unknown[]]

/**
 * Run an effect on every render, or on mount plus non-empty dependency changes.
 *
 * Two call shapes are supported:
 * - `useRenderEffect(effect)` — fires on every render (mount + every re-render)
 * - `useRenderEffect(effect, [dep1, dep2, ...])` — fires on mount and again
 *   whenever any dependency changes (standard `useEffect` semantics with a
 *   non-empty deps list)
 *
 * Passing an empty `[]` is a compile-time error on purpose. For a
 * mount-only effect, use `useInitialEffect` instead — this keeps each hook's
 * intent unambiguous at the call site:
 * - `useInitialEffect`  → mount only (deps = `[]`)
 * - `useUpdateEffect`   → every re-render only (skips mount)
 * - `useUnmountEffect`  → unmount only
 * - `useRenderEffect`   → every render, or mount + non-empty deps changes
 * - `useCycleEffect`    → 1:1 alias of `useEffect` (allows `[]` as deps)
 *
 * The cleanup function returned by `effect` is invoked before each subsequent
 * effect run and on unmount, matching standard `useEffect` semantics.
 *
 * @param effect - The effect callback. May return a cleanup function that
 *   runs before the next effect and on unmount.
 * @param deps - Optional non-empty dependency list. Omit to fire on every
 *   render, or pass at least one dependency to scope re-fires to specific
 *   value changes.
 *
 * @example
 * useRenderEffect(() => {
 *   console.log('rendered')
 * })
 *
 * @example
 * useRenderEffect(() => {
 *   document.title = `Count: ${count}`
 * }, [count])
 *
 * @example
 * // ❌ Type error — use `useInitialEffect` for mount-only effects.
 * useRenderEffect(() => {}, [])
 */
export function useRenderEffect(effect: EffectCallback): void
export function useRenderEffect(
  effect: EffectCallback,
  deps: NonEmptyDependencyList,
): void
export function useRenderEffect(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  // Pass deps through so consumers get exact useEffect semantics for each branch.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, deps)
}
