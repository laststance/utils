# useRest Hook Design Spec

## Problem

react-query requires managing three things per endpoint: cache keys, custom hook names, and endpoint URLs. This ceremony is excessive for straightforward REST API calls. We need a single hook that lets you call REST APIs directly with axios, with zero configuration by default.

## Solution

A single `useRest` hook in `packages/next-react/hooks/use-rest.ts` with TypeScript overloads to support both auto-fetch (GET) and manual trigger (mutation) modes.

**Important**: This hook uses `useState`/`useEffect` and must be used in client components. The file requires a `'use client'` directive.

## API Surface

### Overload Signatures

```tsx
import type { AxiosResponse } from 'axios'

// GET mode (auto-fetch on mount)
function useRest<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  options?: UseRestOptions,
): UseRestResult<T>

// Mutation mode (manual trigger)
function useRest<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  options: UseRestManualOptions,
): UseRestManualResult<T>
```

### Types

```tsx
interface UseRestOptions {
  deps?: unknown[] // Dependency array — auto-refetch when values change
  cache?: boolean // URL-based auto-cache (default: false)
}

interface UseRestManualOptions {
  manual: true // Enable manual trigger mode
}

interface UseRestResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface UseRestManualResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  execute: () => Promise<T>
}
```

### Usage Examples

```tsx
// Basic GET — auto-fetch on mount
const { data, loading, error, refetch } = useRest(() =>
  axios.get<User[]>('/api/users'),
)

// GET with deps — auto-refetch when id changes
const { data } = useRest(() => axios.get<User>(`/api/users/${id}`), {
  deps: [id],
})

// GET with cache — URL-based auto-cache
const { data } = useRest(() => axios.get<User[]>('/api/users'), { cache: true })

// Mutation — manual trigger
const { execute, loading } = useRest(
  () => axios.post<User>('/api/users', newUser),
  { manual: true },
)
const handleSubmit = () => execute()

// Mutation with await
const created = await execute()
```

## Internal State Management

### GET Mode Flow

```
Mount → fetch → loading: true
             ↓
        success → setData(res.data), setError(null), loading: false
        failure → setError(e), loading: false (data preserved)
             ↓
deps change → ignore previous response → new fetch
Unmount → ignore flag ON (discard stale responses)
```

### Mutation Mode Flow

```
Mount → idle (loading: false, data: undefined)
         ↓
execute() → loading: true
         ↓
    success → setData(res.data), setError(null), loading: false
              Promise resolves with T
    failure → setError(e), loading: false
              Promise rejects
```

### State Shape

```tsx
const [data, setData] = useState<T | undefined>(undefined)
const [loading, setLoading] = useState(!manual) // GET: true, manual: false
const [error, setError] = useState<Error | null>(null)
```

### Default Dependency Behavior

When `deps` is not provided, it defaults to `[]` (empty array), meaning **fetch once on mount**. This prevents the common pitfall of `useEffect(..., undefined)` which would re-run on every render.

```tsx
const effectDeps = options?.deps ?? []
```

### Fetcher Ref (stale closure prevention)

The fetcher is stored in a `useRef` and updated every render. This ensures `execute()` in mutation mode and `refetch()` in GET mode always use the latest closure values.

```tsx
const fetcherRef = useRef(fetcher)
fetcherRef.current = fetcher // Updated every render
```

Without this, mutation mode would capture stale form values:

```tsx
// Bad: newUser captured at first render
const { execute } = useRest(() => axios.post('/api/users', newUser), {
  manual: true,
})
// Good: fetcherRef.current always has latest newUser
```

### Stale Response Prevention

Uses the React-recommended ignore flag pattern inside useEffect:

```tsx
useEffect(() => {
  let ignore = false
  fetcherRef
    .current()
    .then((res) => {
      if (!ignore) {
        setData(res.data)
        setError(null)
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
}, effectDeps)
```

AbortController is not used because the fetcher is a closure and signal cannot be injected without changing the API. The ignore flag is sufficient for preventing stale state updates.

## Cache Mechanism

Activated only when `cache: true`. Default is OFF (no caching).

### Cache Store (per-instance via useRef)

```tsx
// Inside the hook — each instance has its own cache
const cacheRef = useRef(new Map<string, { data: unknown }>())
```

The cache lives in a `useRef` so it persists across re-renders but is scoped to each hook instance. This avoids the complexity of cross-component cache sharing and the pre-fetch key derivation problem.

### Cache Key Derivation

Automatically extracted from `AxiosResponse.config` after the first fetch:

```tsx
function deriveCacheKey(response: AxiosResponse): string {
  const { url, params } = response.config
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return `${url}${query}`
}
```

Example: `axios.get('/users', { params: { page: 1 } })` produces key `/users?page=1`.

### Cache Scope: Per-Instance

Cache is **per-hook-instance**, not cross-component. The flow:

1. First fetch always hits the network (cache key unknown until response arrives)
2. After first response, derive and store the cache key internally via `useRef`
3. On subsequent renders (re-mount, deps change with same URL), check cache by stored key
4. `refetch()` bypasses cache and overwrites the stored entry

```
First render    → fetch (no key yet) → response → derive key → store in cacheRef
Re-render       → check cacheRef[storedKey] → HIT → return cached (no fetch)
refetch()       → fetch → response → overwrite cacheRef[key]
deps change     → new fetch → new key → new cache entry
deps revert     → check cacheRef[previousKey] → HIT → return cached
Unmount         → cacheRef discarded (GC'd with component)
```

### Cache Constraints (intentionally simple)

| Included                     | Excluded                      |
| ---------------------------- | ----------------------------- |
| URL+params auto-key          | Manual key specification      |
| Exact-match cache HIT        | TTL / expiration              |
| Per-instance caching         | Cross-component dedup         |
| `refetch()` overwrites cache | Manual cache invalidation API |

Cross-component dedup (inflight request sharing) is out of scope for V1. Each hook instance manages its own cache independently.

## Error Handling

### Error Patterns

| Pattern               | Example              | Hook Behavior                |
| --------------------- | -------------------- | ---------------------------- |
| Network error         | Timeout, DNS failure | Set `error`, preserve `data` |
| HTTP error            | 404, 500             | axios throws → set `error`   |
| Post-unmount response | Component left       | Ignored via ignore flag      |

### Design Decisions

| Decision                     | Reason                                                |
| ---------------------------- | ----------------------------------------------------- |
| `data` preserved on error    | Prevents UI flash to empty state on transient errors  |
| `execute()` rejects on error | Callers can use try-catch for specific error handling |
| `error` holds latest only    | Error history is unnecessary complexity               |
| `error` cleared on success   | `refetch()` or `execute()` success resets error state |

### Mutation Error Handling (dual path)

```tsx
// Path 1: Reactive (via hook state)
const { execute, error } = useRest(() => axios.post('/api/users', body), {
  manual: true,
})
if (error) showToast(error.message)

// Path 2: Imperative (via try-catch)
try {
  const user = await execute()
} catch (e) {
  // Handle per-call
}
```

## File Structure

```
packages/next-react/
  hooks/
    use-rest.ts          # Hook implementation + cache store + types
    use-rest.test.ts     # Tests
```

Cache store lives in the same file as the hook (per-instance via `useRef`). No separate file needed.

## Dependencies

Add to `packages/next-react/package.json`:

```json
{
  "dependencies": {
    "axios": "^1.13.6"
  }
}
```

## Test Plan

| Category          | Test Case                                                               |
| ----------------- | ----------------------------------------------------------------------- |
| GET basic         | Mount → fetch → data set, loading transitions                           |
| GET deps          | deps change → re-fetch, previous response ignored                       |
| GET refetch       | `refetch()` call → re-fetch                                             |
| GET error         | Fetch error → error set, data preserved                                 |
| Cache             | `cache: true` → second call returns cached, no network                  |
| Cache deps revert | `deps: [page]` changes 1→2→1 with `cache: true` → page=1 returns cached |
| Cache + refetch   | `refetch()` → cache overwritten                                         |
| Mutation basic    | No fetch on mount, `execute()` fires request                            |
| Mutation return   | `execute()` returns `Promise<T>`                                        |
| Mutation error    | `execute()` failure → error set + Promise rejects                       |
| Unmount safety    | Fetch in-flight + unmount → no state update                             |
| Type inference    | `AxiosResponse<T>` infers `data: T` (via `expectTypeOf` from Vitest)    |

### Test Approach

```tsx
vi.mock('axios')

const { result } = renderHook(() =>
  useRest(() => axios.get<User[]>('/api/users'))
)

await waitFor(() => {
  expect(result.current.loading).toBe(false)
  expect(result.current.data).toEqual([...])
})
```

## Limitations

- **Mutation + cache combination**: `manual: true` and `cache: true` cannot be combined in V1. Mutation mode has no auto-fetch, so cache timing semantics are unclear. If needed, this can be added in a future version.
- **No cross-component cache sharing**: Each hook instance has its own cache. Two components calling the same URL will each fetch independently. Cross-component dedup requires a context provider (future enhancement).

## Future Considerations (out of scope)

- AbortController signal injection via `(signal) => axios.get(url, { signal })` API variant
- Cache TTL / expiration
- Cross-component cache sharing via React context provider
- `onSuccess` / `onError` callback options
- Global configuration provider (like SWR's `SWRConfig`)
- Retry logic
