# useRest Hook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a lightweight `useRest` React hook that simplifies REST API calls with axios, eliminating cache key and hook name management.

**Architecture:** Single hook with TypeScript overloads — GET mode (auto-fetch) and mutation mode (manual trigger). Per-instance URL-based cache via `deriveCacheKey(response)` with deps-to-URL mapping for cache lookup. Stale closure prevention via `fetcherRef`. Unmount safety via ignore flags and `unmountedRef`.

**Tech Stack:** React 19, TypeScript 5.9, axios, Vitest + @testing-library/react

**Spec:** `docs/superpowers/specs/2026-03-25-use-rest-hook-design.md`

---

## File Structure

| Action | Path                                         | Responsibility                              |
| ------ | -------------------------------------------- | ------------------------------------------- |
| Create | `packages/next-react/hooks/use-rest.ts`      | Hook implementation + types + cache utility |
| Create | `packages/next-react/hooks/use-rest.test.ts` | All unit tests                              |

**Note:** `axios` is already in `packages/next-react/package.json` dependencies. No dependency changes needed.

---

## Task 1: Types + deriveCacheKey utility

**Files:**

- Create: `packages/next-react/hooks/use-rest.ts`
- Create: `packages/next-react/hooks/use-rest.test.ts`

- [ ] **Step 1: Write failing test for deriveCacheKey**

```tsx
// packages/next-react/hooks/use-rest.test.ts
import type { AxiosResponse } from 'axios'
import { describe, it, expect } from 'vitest'

import { deriveCacheKey } from '@/hooks/use-rest'

describe('deriveCacheKey', () => {
  it('should derive key from URL', () => {
    const response = {
      config: { url: '/api/users', params: undefined },
    } as AxiosResponse

    expect(deriveCacheKey(response)).toBe('/api/users')
  })

  it('should include query params in key', () => {
    const response = {
      config: { url: '/api/users', params: { page: '1', limit: '10' } },
    } as AxiosResponse

    expect(deriveCacheKey(response)).toBe('/api/users?page=1&limit=10')
  })

  it('should return empty string when url is undefined', () => {
    const response = {
      config: { url: undefined, params: undefined },
    } as AxiosResponse

    expect(deriveCacheKey(response)).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: FAIL — `deriveCacheKey` not found

- [ ] **Step 3: Write types and deriveCacheKey**

```tsx
// packages/next-react/hooks/use-rest.ts
'use client'

import type { AxiosResponse } from 'axios'

// === Types ===

/** Options for GET mode (auto-fetch on mount) */
export interface UseRestOptions {
  /** Dependency array — auto-refetch when values change */
  deps?: unknown[]
  /** Enable per-instance cache keyed by deps (default: false) */
  cache?: boolean
}

/** Options for mutation mode (manual trigger) */
export interface UseRestManualOptions {
  /** Enable manual trigger mode */
  manual: true
}

/** Return type for GET mode */
export interface UseRestResult<T> {
  /** Fetched data (undefined until first successful fetch) */
  data: T | undefined
  /** Whether a fetch is in progress */
  loading: boolean
  /** Latest error (null if last fetch succeeded) */
  error: Error | null
  /** Manually re-fetch, bypassing cache */
  refetch: () => Promise<void>
}

/** Return type for mutation mode */
export interface UseRestManualResult<T> {
  /** Response data from last execute() call */
  data: T | undefined
  /** Whether an execute() call is in progress */
  loading: boolean
  /** Latest error (null if last execute succeeded) */
  error: Error | null
  /** Trigger the request manually */
  execute: () => Promise<T>
}

/**
 * Derives a cache key from an AxiosResponse's request config.
 * Combines URL and query params into a single string key.
 *
 * @param response - The Axios response to derive the key from
 * @returns Cache key string
 * @example
 * // GET /api/users?page=1
 * deriveCacheKey(response) // => "/api/users?page=1"
 *
 * // GET /api/users (no params)
 * deriveCacheKey(response) // => "/api/users"
 */
export function deriveCacheKey(response: AxiosResponse): string {
  const { url, params } = response.config
  if (!url) return ''
  const query = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : ''
  return `${url}${query}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add packages/next-react/hooks/use-rest.ts packages/next-react/hooks/use-rest.test.ts
git commit -m "feat(next-react): add useRest types and deriveCacheKey utility"
```

---

## Task 2: GET basic mode (auto-fetch + loading transitions)

**Files:**

- Modify: `packages/next-react/hooks/use-rest.ts`
- Modify: `packages/next-react/hooks/use-rest.test.ts`

- [ ] **Step 1: Write failing tests for GET basic**

Append to test file:

```tsx
import { renderHook, waitFor } from '@testing-library/react'

import { useRest } from '@/hooks/use-rest'

/**
 * Creates a mock AxiosResponse for testing.
 */
function mockAxiosResponse<T>(data: T, url = '/api/test'): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url, headers: {} as any },
  } as AxiosResponse<T>
}

describe('useRest — GET basic', () => {
  it('should fetch data on mount and set loading states', async () => {
    const users = [{ id: 1, name: 'Alice' }]
    const fetcher = vi.fn().mockResolvedValue(mockAxiosResponse(users))

    const { result } = renderHook(() => useRest(fetcher))

    // Initial state: loading true
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(users)
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalledOnce()
  })

  it('should only fetch once on mount when no deps provided', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockAxiosResponse('data'))

    const { result, rerender } = renderHook(() => useRest(fetcher))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    rerender()
    rerender()

    expect(fetcher).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: FAIL — `useRest` not defined

- [ ] **Step 3: Implement GET basic mode**

Add to `use-rest.ts` after `deriveCacheKey`:

```tsx
import { useState, useEffect, useRef, useCallback } from 'react'

// === Hook Overloads ===

/**
 * Lightweight React hook for REST API calls with axios.
 * Eliminates the need for cache key and hook name management.
 *
 * @param fetcher - Function returning an axios Promise
 * @param options - GET mode options (deps, cache)
 * @returns Object with data, loading, error, and refetch
 * @example
 * // Basic GET — auto-fetch on mount
 * const { data, loading } = useRest(() => axios.get<User[]>('/api/users'))
 *
 * // GET with deps — auto-refetch when id changes
 * const { data } = useRest(() => axios.get<User>(`/api/users/${id}`), { deps: [id] })
 */
export function useRest<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  options?: UseRestOptions,
): UseRestResult<T>

/**
 * @param fetcher - Function returning an axios Promise
 * @param options - Manual mode options (manual: true)
 * @returns Object with data, loading, error, and execute
 * @example
 * // Mutation — manual trigger
 * const { execute, loading } = useRest(
 *   () => axios.post<User>('/api/users', body),
 *   { manual: true },
 * )
 */
export function useRest<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  options: UseRestManualOptions,
): UseRestManualResult<T>

// === Implementation ===

export function useRest<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  options?: UseRestOptions | UseRestManualOptions,
): UseRestResult<T> | UseRestManualResult<T> {
  const manual = !!options && 'manual' in options && options.manual === true
  const cacheEnabled =
    !manual && !!options && 'cache' in options && !!options.cache
  const deps =
    !manual && options && 'deps' in options ? options.deps : undefined

  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(!manual)
  const [error, setError] = useState<Error | null>(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const unmountedRef = useRef(false)
  useEffect(() => {
    return () => {
      unmountedRef.current = true
    }
  }, [])

  // Cache: URL-based keys via deriveCacheKey, with deps→URL mapping for lookup
  const cacheRef = useRef(new Map<string, T>()) // URL key → data
  const depsToUrlRef = useRef(new Map<string, string>()) // serialized deps → URL key
  const effectDeps = deps ?? []
  const effectDepsRef = useRef(effectDeps)
  effectDepsRef.current = effectDeps

  // GET mode: auto-fetch on mount / deps change
  useEffect(() => {
    if (manual) return

    let ignore = false
    const serializedDeps = JSON.stringify(effectDepsRef.current)

    // Cache check: deps → URL key → cached data
    if (cacheEnabled) {
      const urlKey = depsToUrlRef.current.get(serializedDeps)
      if (urlKey) {
        const cached = cacheRef.current.get(urlKey)
        if (cached !== undefined) {
          setData(cached)
          setError(null)
          setLoading(false)
          return
        }
      }
    }

    setLoading(true)
    fetcherRef
      .current()
      .then((res) => {
        if (!ignore) {
          setData(res.data)
          setError(null)
        }
        if (cacheEnabled) {
          const urlKey = deriveCacheKey(res)
          cacheRef.current.set(urlKey, res.data)
          depsToUrlRef.current.set(serializedDeps, urlKey)
        }
      })
      .catch((e) => {
        if (!ignore) {
          setError(e instanceof Error ? e : new Error(String(e)))
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps)

  // refetch (GET mode) — always bypasses cache, overwrites entry
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await fetcherRef.current()
      if (!unmountedRef.current) {
        setData(res.data)
        setError(null)
        if (cacheEnabled) {
          const urlKey = deriveCacheKey(res)
          const serializedDeps = JSON.stringify(effectDepsRef.current)
          cacheRef.current.set(urlKey, res.data)
          depsToUrlRef.current.set(serializedDeps, urlKey)
        }
      }
    } catch (e) {
      if (!unmountedRef.current) {
        setError(e instanceof Error ? e : new Error(String(e)))
      }
    } finally {
      if (!unmountedRef.current) {
        setLoading(false)
      }
    }
  }, [cacheEnabled])

  // execute (mutation mode)
  const execute = useCallback(async (): Promise<T> => {
    setLoading(true)
    try {
      const res = await fetcherRef.current()
      if (!unmountedRef.current) {
        setData(res.data)
        setError(null)
        setLoading(false)
      }
      return res.data
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      if (!unmountedRef.current) {
        setError(err)
        setLoading(false)
      }
      throw err
    }
  }, [])

  if (manual) {
    return { data, loading, error, execute } as UseRestManualResult<T>
  }

  return { data, loading, error, refetch } as UseRestResult<T>
}
```

**Note:** The full implementation is written here because all pieces (GET, cache, mutation, unmount safety) are tightly coupled in a single function. Subsequent tasks add tests for each feature, not new implementation code.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS (5 tests — 3 deriveCacheKey + 2 GET basic)

- [ ] **Step 5: Commit**

```bash
git add packages/next-react/hooks/use-rest.ts packages/next-react/hooks/use-rest.test.ts
git commit -m "feat(next-react): implement useRest hook with GET mode"
```

---

## Task 3: GET deps + refetch + error handling tests

**Files:**

- Modify: `packages/next-react/hooks/use-rest.test.ts`

- [ ] **Step 1: Write tests for GET deps**

```tsx
describe('useRest — GET deps', () => {
  it('should refetch when deps change', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(mockAxiosResponse({ id: 1 }, '/api/users/1'))
      .mockResolvedValueOnce(mockAxiosResponse({ id: 2 }, '/api/users/2'))

    const { result, rerender } = renderHook(
      ({ id }) => useRest(() => fetcher(), { deps: [id] }),
      { initialProps: { id: 1 } },
    )

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1 })
    })

    rerender({ id: 2 })

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 })
    })

    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('should ignore stale response when deps change rapidly', async () => {
    let resolvers: Array<(value: AxiosResponse) => void> = []
    const fetcher = vi.fn().mockImplementation(
      () =>
        new Promise<AxiosResponse>((resolve) => {
          resolvers.push(resolve)
        }),
    )

    const { result, rerender } = renderHook(
      ({ id }) => useRest(() => fetcher(), { deps: [id] }),
      { initialProps: { id: 1 } },
    )

    // Change deps before first fetch completes
    rerender({ id: 2 })

    // Resolve second fetch first, then first
    resolvers[1]!(mockAxiosResponse({ id: 2 }, '/api/users/2'))
    resolvers[0]!(mockAxiosResponse({ id: 1 }, '/api/users/1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have data from second fetch (id: 2), not stale first fetch
    expect(result.current.data).toEqual({ id: 2 })
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS

- [ ] **Step 3: Write tests for refetch and error handling**

```tsx
import { act } from '@testing-library/react'

describe('useRest — GET refetch', () => {
  it('should refetch when refetch() is called', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(mockAxiosResponse('first'))
      .mockResolvedValueOnce(mockAxiosResponse('second'))

    const { result } = renderHook(() => useRest(fetcher))

    await waitFor(() => {
      expect(result.current.data).toBe('first')
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data).toBe('second')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})

describe('useRest — GET error', () => {
  it('should set error on fetch failure and preserve previous data', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(mockAxiosResponse('good-data'))
      .mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useRest(fetcher))

    await waitFor(() => {
      expect(result.current.data).toBe('good-data')
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.error).toEqual(new Error('Network error'))
    expect(result.current.data).toBe('good-data') // preserved
    expect(result.current.loading).toBe(false)
  })

  it('should clear error on successful refetch', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockAxiosResponse('recovered'))

    const { result } = renderHook(() => useRest(fetcher))

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toBe('recovered')
  })
})
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/next-react/hooks/use-rest.test.ts
git commit -m "test(next-react): add useRest GET deps, refetch, and error tests"
```

---

## Task 4: Cache mechanism tests

**Files:**

- Modify: `packages/next-react/hooks/use-rest.test.ts`

- [ ] **Step 1: Write tests for cache basic + deps revert**

```tsx
describe('useRest — cache', () => {
  it('should store data in cache after first fetch with cache: true', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(mockAxiosResponse('cached-data', '/api/data'))

    const { result } = renderHook(() => useRest(fetcher, { cache: true }))

    await waitFor(() => {
      expect(result.current.data).toBe('cached-data')
    })

    // Only one fetch — no deps means useEffect runs once
    expect(fetcher).toHaveBeenCalledOnce()
    expect(result.current.loading).toBe(false)
  })

  it('should return cached data without refetching on deps revert', async () => {
    let callCount = 0
    const fetcher = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve(
        mockAxiosResponse(`page-${callCount}`, `/api/items?page=${callCount}`),
      )
    })

    const { result, rerender } = renderHook(
      ({ page }) => useRest(() => fetcher(), { deps: [page], cache: true }),
      { initialProps: { page: 1 } },
    )

    // First fetch: page 1
    await waitFor(() => {
      expect(result.current.data).toBe('page-1')
    })
    expect(fetcher).toHaveBeenCalledTimes(1)

    // Change to page 2: new fetch
    rerender({ page: 2 })
    await waitFor(() => {
      expect(result.current.data).toBe('page-2')
    })
    expect(fetcher).toHaveBeenCalledTimes(2)

    // Revert to page 1: cache hit, no fetch
    rerender({ page: 1 })
    await waitFor(() => {
      expect(result.current.data).toBe('page-1')
    })
    expect(fetcher).toHaveBeenCalledTimes(2) // No additional fetch
  })

  it('should overwrite cache on refetch', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(mockAxiosResponse('original'))
      .mockResolvedValueOnce(mockAxiosResponse('updated'))

    const { result } = renderHook(() => useRest(fetcher, { cache: true }))

    await waitFor(() => {
      expect(result.current.data).toBe('original')
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data).toBe('updated')
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add packages/next-react/hooks/use-rest.test.ts
git commit -m "test(next-react): add useRest cache mechanism tests"
```

---

## Task 5: Mutation mode tests

**Files:**

- Modify: `packages/next-react/hooks/use-rest.test.ts`

- [ ] **Step 1: Write tests for mutation basic + return + error**

```tsx
describe('useRest — mutation', () => {
  it('should not fetch on mount in manual mode', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockAxiosResponse('data'))

    const { result } = renderHook(() => useRest(fetcher, { manual: true }))

    // Wait a tick to ensure no async fetch started
    await new Promise((r) => setTimeout(r, 50))

    expect(fetcher).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should fetch when execute() is called and return data', async () => {
    const user = { id: 1, name: 'Alice' }
    const fetcher = vi.fn().mockResolvedValue(mockAxiosResponse(user))

    const { result } = renderHook(() => useRest(fetcher, { manual: true }))

    let returnedData: typeof user | undefined
    await act(async () => {
      returnedData = await result.current.execute()
    })

    expect(returnedData).toEqual(user)
    expect(result.current.data).toEqual(user)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set error and reject on execute() failure', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useRest(fetcher, { manual: true }))

    await act(async () => {
      await expect(result.current.execute()).rejects.toThrow('Server error')
    })

    expect(result.current.error).toEqual(new Error('Server error'))
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should use latest fetcher closure values', async () => {
    const { result, rerender } = renderHook(
      ({ body }) =>
        useRest(
          () =>
            Promise.resolve(mockAxiosResponse(`sent: ${body}`)) as Promise<
              AxiosResponse<string>
            >,
          { manual: true },
        ),
      { initialProps: { body: 'first' } },
    )

    rerender({ body: 'latest' })

    let returnedData: string | undefined
    await act(async () => {
      returnedData = await result.current.execute()
    })

    // Should use the latest closure, not the stale one
    expect(returnedData).toBe('sent: latest')
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add packages/next-react/hooks/use-rest.test.ts
git commit -m "test(next-react): add useRest mutation mode tests"
```

---

## Task 6: Unmount safety + type inference tests

**Files:**

- Modify: `packages/next-react/hooks/use-rest.test.ts`

- [ ] **Step 1: Write unmount safety and type tests**

```tsx
import { expectTypeOf } from 'vitest'

describe('useRest — unmount safety', () => {
  it('should not update state after unmount (GET mode)', async () => {
    let resolver: (value: AxiosResponse) => void
    const fetcher = vi.fn().mockImplementation(
      () =>
        new Promise<AxiosResponse>((resolve) => {
          resolver = resolve
        }),
    )

    const { result, unmount } = renderHook(() => useRest(fetcher))

    // Unmount before fetch completes
    unmount()

    // Resolve after unmount — should not throw or update state
    resolver!(mockAxiosResponse('late-data'))

    // Give time for any async effects
    await new Promise((r) => setTimeout(r, 50))

    // If we got here without errors, unmount safety works
    expect(fetcher).toHaveBeenCalledOnce()
  })
})

describe('useRest — type inference', () => {
  it('should infer data type from AxiosResponse generic', () => {
    type User = { id: number; name: string }

    // GET mode: data should be User[] | undefined
    const getResult = {} as UseRestResult<User[]>
    expectTypeOf(getResult.data).toEqualTypeOf<User[] | undefined>()
    expectTypeOf(getResult.loading).toEqualTypeOf<boolean>()
    expectTypeOf(getResult.error).toEqualTypeOf<Error | null>()
    expectTypeOf(getResult.refetch).toEqualTypeOf<() => Promise<void>>()
  })

  it('should infer execute return type in manual mode', () => {
    type User = { id: number; name: string }

    // Manual mode: execute should return Promise<User>
    const manualResult = {} as UseRestManualResult<User>
    expectTypeOf(manualResult.data).toEqualTypeOf<User | undefined>()
    expectTypeOf(manualResult.execute).toEqualTypeOf<() => Promise<User>>()
  })
})
```

Add `UseRestResult` and `UseRestManualResult` to the imports at the top of the test file:

```tsx
import {
  useRest,
  deriveCacheKey,
  type UseRestResult,
  type UseRestManualResult,
} from '@/hooks/use-rest'
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd packages/next-react && pnpm test -- hooks/use-rest.test.ts`
Expected: PASS (all tests)

- [ ] **Step 3: Commit**

```bash
git add packages/next-react/hooks/use-rest.test.ts
git commit -m "test(next-react): add useRest unmount safety and type inference tests"
```

---

## Task 7: Final validation

- [ ] **Step 1: Run full test suite for next-react**

Run: `cd packages/next-react && pnpm test`
Expected: All tests pass

- [ ] **Step 2: Run typecheck**

Run: `pnpm --filter next-react typecheck`
Expected: No type errors

- [ ] **Step 3: Run lint**

Run: `pnpm --filter next-react lint`
Expected: No new lint errors

- [ ] **Step 4: Commit if any lint/format fixes needed**

```bash
git add -A && git commit -m "chore(next-react): lint and format fixes"
```

(Skip if no changes needed)

- [ ] **Step 5: Run full monorepo validation**

Run: `pnpm validate`
Expected: All packages pass (typecheck + test + lint + build)
