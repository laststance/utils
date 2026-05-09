'use client'

import { createContext, use, useState } from 'react'

const DEFAULT_THEME = 'dark'

const THEME_OPTIONS = ['dark', 'light', 'sunset'] as const

const ThemeContext =
  createContext<(typeof THEME_OPTIONS)[number]>(DEFAULT_THEME)

interface UseStudyDemoProps {
  messagePromise: Promise<string>
}

interface UseStudyResultProps {
  messagePromise: Promise<string>
  isThemeVisible: boolean
}

/**
 * Shows an interactive React `use()` study demo.
 */
export function UseStudyDemo({ messagePromise }: UseStudyDemoProps) {
  const [selectedTheme, setSelectedTheme] =
    useState<(typeof THEME_OPTIONS)[number]>(DEFAULT_THEME)
  const [isThemeVisible, setIsThemeVisible] = useState(true)

  return (
    <ThemeContext value={selectedTheme}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 rounded-2xl border border-black/10 bg-black/3 p-5 dark:border-white/10 dark:bg-white/4 sm:grid-cols-2">
          <label className="flex min-h-11 flex-col gap-2 text-sm font-medium">
            Theme context value
            <select
              aria-label="Theme context value"
              className="min-h-11 rounded-xl border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/15"
              value={selectedTheme}
              onChange={(event) =>
                setSelectedTheme(
                  event.target.value as (typeof THEME_OPTIONS)[number],
                )
              }
            >
              {THEME_OPTIONS.map((themeOption) => (
                <option key={themeOption} value={themeOption}>
                  {themeOption}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-dashed border-black/10 px-4 py-3 text-sm dark:border-white/15">
            <input
              aria-label="Show theme context value"
              checked={isThemeVisible}
              className="size-4"
              type="checkbox"
              onChange={(event) => setIsThemeVisible(event.target.checked)}
            />
            Show the context value read with `use(ThemeContext)`
          </label>
        </div>

        <UseStudyResult
          isThemeVisible={isThemeVisible}
          messagePromise={messagePromise}
        />
      </div>
    </ThemeContext>
  )
}

/**
 * Reads both a Promise and a Context with React `use()`.
 */
function UseStudyResult({
  messagePromise,
  isThemeVisible,
}: UseStudyResultProps) {
  const resolvedMessage = use(messagePromise)
  const currentTheme = isThemeVisible ? use(ThemeContext) : 'hidden'

  return (
    <div className="rounded-3xl border border-violet-500/20 bg-violet-500/6 p-6 dark:border-violet-400/25 dark:bg-violet-400/8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">
        Live demo
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl bg-background p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <h3 className="text-sm font-semibold">Promise read with `use()`</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This value came from a Promise created in the Server Component.
          </p>
          <p className="mt-4 rounded-xl bg-muted px-3 py-3 font-mono text-sm">
            {resolvedMessage}
          </p>
        </article>

        <article className="rounded-2xl bg-background p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <h3 className="text-sm font-semibold">
            Conditional context read with `use()`
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Toggle the checkbox above to see that `use(ThemeContext)` can be
            called conditionally.
          </p>
          <p className="mt-4 rounded-xl bg-muted px-3 py-3 font-mono text-sm">
            {currentTheme}
          </p>
        </article>
      </div>
    </div>
  )
}
