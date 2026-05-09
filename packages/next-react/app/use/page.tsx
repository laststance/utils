import Link from 'next/link'
import { Suspense } from 'react'

import { UseStudyDemo } from './use-study-demo'

const DOCS_URL = 'https://react.dev/reference/react/use'
const MESSAGE_DELAY_MS = 1200

const PROMISE_CODE_EXAMPLE = `// Server Component
const messagePromise = getMessage();

<Suspense fallback={<p>Loading...</p>}>
  <ClientDemo messagePromise={messagePromise} />
</Suspense>`

const CONTEXT_CODE_EXAMPLE = `// Client Component
const theme = showTheme ? use(ThemeContext) : 'hidden';`

/**
 * Creates a stable Promise for the React `use()` learning page.
 */
async function createStudyMessagePromise(): Promise<string> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, MESSAGE_DELAY_MS)
  })
  return 'Server Promise resolved. `use(messagePromise)` can now read it.'
}

/**
 * Renders a study page for learning React `use()`.
 */
export default function UseStudyPage() {
  const messagePromise = createStudyMessagePromise()

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10 sm:px-10 sm:py-16">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">
          React API Study
        </p>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Learn React `use()`
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            This page focuses on two practical uses of React `use()`: reading a
            Promise inside a Suspense boundary and reading Context conditionally
            inside a Client Component.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            href="/"
          >
            Back to home
          </Link>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 px-5 py-2 text-sm font-medium transition-colors hover:bg-black/4 dark:border-white/15 dark:hover:bg-white/6"
            href={DOCS_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open official docs
          </a>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold">What `use()` does</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            `use()` reads a resource during rendering. In practice, that usually
            means a Promise or a Context value.
          </p>
        </article>
        <article className="rounded-3xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold">What to watch</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-muted-foreground">
            <li>Suspense fallback appears while the Promise is pending.</li>
            <li>`use(ThemeContext)` can be called conditionally.</li>
            <li>
              Client Components should read a stable Promise from the server.
            </li>
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-black/10 p-6 dark:border-white/10">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">Interactive demo</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            The fallback should render for about {MESSAGE_DELAY_MS}ms before the
            Promise-backed message appears.
          </p>
        </div>

        <div className="mt-6">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-dashed border-violet-500/25 bg-violet-500/4 p-6 text-sm text-muted-foreground dark:border-violet-400/25 dark:bg-violet-400/6">
                Waiting for the Promise to resolve...
              </div>
            }
          >
            <UseStudyDemo messagePromise={messagePromise} />
          </Suspense>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold">Promise pattern</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-muted p-4 text-xs leading-6">
            <code>{PROMISE_CODE_EXAMPLE}</code>
          </pre>
        </article>
        <article className="rounded-3xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold">Conditional context pattern</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-muted p-4 text-xs leading-6">
            <code>{CONTEXT_CODE_EXAMPLE}</code>
          </pre>
        </article>
      </section>

      <section className="rounded-3xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="text-lg font-semibold">Practice ideas</h2>
        <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-6 text-muted-foreground">
          <li>Change the Promise message to include the selected theme.</li>
          <li>Add a second Promise and compare two Suspense boundaries.</li>
          <li>
            Try replacing conditional `use(ThemeContext)` with `useContext`.
          </li>
        </ol>
      </section>
    </main>
  )
}
