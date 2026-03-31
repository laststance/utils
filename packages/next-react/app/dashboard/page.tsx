import { format } from 'date-fns'
import type { Metadata } from 'next'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getIWriteCodeDashboardData,
  type IWriteCodeDashboardData,
} from '@/lib/i-write-code/activity'
import { cn } from '@/lib/utils'

const DAY_LABELS = ['Mon', 'Wed', 'Fri']
const CONTRIBUTION_LEVELS = [0, 1, 2, 3, 4] as const
const CATEGORY_LABELS: Record<string, string> = {
  'laststance-repo': 'Laststance Repo',
  'web-ui': 'Web UI',
  'mdn-javascript-api': 'MDN JavaScript API',
  'library-internals': 'Library Internals',
  'python-rust': 'Python / Rust',
}

export const metadata: Metadata = {
  title: 'i-write-code Dashboard',
  description: 'Local reflection dashboard for i-write-code activity sessions.',
}

/**
 * Renders the local i-write-code reflection dashboard.
 */
export default async function Page() {
  const dashboardData = await getIWriteCodeDashboardData()
  const hasEntries = dashboardData.entries.length > 0

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="min-h-11 px-4 text-sm">
            Local reflection dashboard
          </Badge>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              i-write-code activity review
            </h1>
            <p className="text-muted-foreground max-w-3xl text-sm leading-6">
              Review your coding streak, contribution heatmap, and the lessons
              you captured from each daily session.
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Activity file:{' '}
          <code className="rounded bg-muted px-2 py-1">
            {dashboardData.activityFilePath}
          </code>
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Total sessions"
          value={dashboardData.stats.totalSessions.toString()}
          hint="Saved i-write-code reflections"
        />
        <DashboardMetricCard
          label="Active days"
          value={dashboardData.stats.activeDays.toString()}
          hint="Unique coding days in the log"
        />
        <DashboardMetricCard
          label="Current streak"
          value={`${dashboardData.stats.currentStreak} day${dashboardData.stats.currentStreak === 1 ? '' : 's'}`}
          hint="Continues when your latest session was today or yesterday"
        />
        <DashboardMetricCard
          label="Total effort"
          value={formatEffort(dashboardData.stats.totalEffortMinutes)}
          hint="Rounded sum of logged focus time"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <ContributionHeatmapCard dashboardData={dashboardData} />
        <div className="grid gap-6">
          <RecentSessionsCard dashboardData={dashboardData} />
          <CategoryBreakdownCard dashboardData={dashboardData} />
          <LearningHighlightsCard dashboardData={dashboardData} />
        </div>
      </section>

      {!hasEntries ? (
        <Card>
          <CardHeader>
            <CardTitle>Log your first session</CardTitle>
            <CardDescription>
              The dashboard will fill in automatically after `i-write-code`
              appends a reflection entry to the local activity file.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </main>
  )
}

/**
 * Displays a single summary metric at the top of the dashboard.
 */
function DashboardMetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card>
      <CardHeader className="gap-1">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {hint}
      </CardContent>
    </Card>
  )
}

/**
 * Renders the GitHub-style contribution view with week columns and daily cells.
 */
function ContributionHeatmapCard({
  dashboardData,
}: {
  dashboardData: IWriteCodeDashboardData
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution heatmap</CardTitle>
        <CardDescription>
          A six-month view of how consistently you turned study ideas into real
          code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex min-w-full gap-3">
            <div className="grid min-w-10 grid-rows-[24px_repeat(7,1fr)] gap-2 pt-1 text-xs text-muted-foreground">
              <div />
              {Array.from({ length: 7 }, (_, dayIndex) => (
                <div
                  key={`day-label-${dayIndex}`}
                  className="flex h-4 items-center"
                >
                  {DAY_LABELS.includes(formatDayLabel(dayIndex))
                    ? formatDayLabel(dayIndex)
                    : ''}
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <div
                className="grid auto-cols-[minmax(12px,1fr)] grid-flow-col gap-1.5 text-xs text-muted-foreground"
                aria-hidden="true"
              >
                {dashboardData.heatmapWeeks.map((week) => (
                  <div key={`${week.id}-month`} className="min-w-3">
                    {week.monthLabel}
                  </div>
                ))}
              </div>
              <div className="grid auto-cols-[minmax(12px,1fr)] grid-flow-col gap-1.5">
                {dashboardData.heatmapWeeks.map((week) => (
                  <div key={week.id} className="grid grid-rows-7 gap-1.5">
                    {week.days.map((day) => (
                      <div
                        key={day.date}
                        className={cn(
                          'h-3.5 w-3.5 rounded border border-transparent transition-colors',
                          getContributionClassName(
                            day.contributionLevel,
                            day.isToday,
                          ),
                        )}
                        title={buildContributionTitle(day)}
                        aria-label={buildContributionTitle(day)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">
            Longest streak:{' '}
            <span className="text-foreground font-medium">
              {dashboardData.stats.longestStreak}
            </span>{' '}
            day{dashboardData.stats.longestStreak === 1 ? '' : 's'}
          </p>
          <ContributionLegend />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Shows the color scale used in the contribution heatmap.
 */
function ContributionLegend() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Less</span>
      <div className="flex items-center gap-1">
        {CONTRIBUTION_LEVELS.map((level) => (
          <span
            key={`legend-${level}`}
            className={cn(
              'h-3.5 w-3.5 rounded',
              getContributionClassName(level, false),
            )}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs">More</span>
    </div>
  )
}

/**
 * Lists the latest saved sessions with their category and lessons.
 */
function RecentSessionsCard({
  dashboardData,
}: {
  dashboardData: IWriteCodeDashboardData
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sessions</CardTitle>
        <CardDescription>
          The latest reflections saved by i-write-code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dashboardData.recentEntries.length > 0 ? (
          dashboardData.recentEntries.map((entry) => (
            <article key={entry.id} className="space-y-2 rounded-xl border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {CATEGORY_LABELS[entry.category] ?? entry.category}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{entry.taskTitle}</h3>
                <p className="text-muted-foreground text-sm">{entry.outcome}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.learned.map((learnedItem) => (
                  <Badge key={`${entry.id}-${learnedItem}`} variant="secondary">
                    {learnedItem}
                  </Badge>
                ))}
              </div>
            </article>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No sessions yet. Finish one `i-write-code` run and the recent
            activity list will appear here.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Summarizes how often each category appears in the local activity log.
 */
function CategoryBreakdownCard({
  dashboardData,
}: {
  dashboardData: IWriteCodeDashboardData
}) {
  const highestCount = Math.max(
    1,
    ...dashboardData.categorySummaries.map((summary) => summary.count),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category mix</CardTitle>
        <CardDescription>
          Which kinds of coding sessions you returned to most often.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dashboardData.categorySummaries.length > 0 ? (
          dashboardData.categorySummaries.map((summary) => (
            <div key={summary.category} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>{summary.label}</span>
                <span className="text-muted-foreground">{summary.count}</span>
              </div>
              <div className="bg-muted h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(summary.count / highestCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Categories will appear once the first activity is saved.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Highlights the learning notes that surfaced most often in the log.
 */
function LearningHighlightsCard({
  dashboardData,
}: {
  dashboardData: IWriteCodeDashboardData
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning highlights</CardTitle>
        <CardDescription>
          Repeated ideas that deserve another deeper coding session.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {dashboardData.learningHighlights.length > 0 ? (
          dashboardData.learningHighlights.map((learningItem) => (
            <Badge
              key={learningItem}
              variant="secondary"
              className="min-h-11 px-4"
            >
              {learningItem}
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Save at least one `learned` note to see patterns here.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Formats total effort into a compact hours-and-minutes label.
 */
function formatEffort(totalEffortMinutes: number): string {
  const hours = Math.floor(totalEffortMinutes / 60)
  const minutes = totalEffortMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}

/**
 * Returns short weekday labels aligned to a Monday-first calendar.
 */
function formatDayLabel(dayIndex: number): string {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex] ?? ''
}

/**
 * Creates a readable tooltip for each contribution cell.
 */
function buildContributionTitle(day: {
  accessibleLabel: string
  sessionCount: number
  totalEffortMinutes: number
}): string {
  if (day.sessionCount === 0) {
    return `${day.accessibleLabel}: no logged coding session`
  }

  return `${day.accessibleLabel}: ${day.sessionCount} session${day.sessionCount === 1 ? '' : 's'}, ${day.totalEffortMinutes} minutes`
}

/**
 * Maps contribution intensity to dashboard color tokens.
 */
function getContributionClassName(
  contributionLevel: number,
  isToday: boolean,
): string {
  const levelClasses = [
    'bg-muted/70',
    'bg-emerald-200 dark:bg-emerald-950',
    'bg-emerald-300 dark:bg-emerald-800',
    'bg-emerald-500 dark:bg-emerald-600',
    'bg-emerald-700 dark:bg-emerald-400',
  ]
  const safeContributionLevel = Math.min(
    CONTRIBUTION_LEVELS[CONTRIBUTION_LEVELS.length - 1] ?? 0,
    Math.max(0, contributionLevel),
  )
  const baseClassName =
    levelClasses[safeContributionLevel] ??
    levelClasses[CONTRIBUTION_LEVELS[0]] ??
    'bg-muted/70'

  return isToday ? `${baseClassName} ring-2 ring-primary/40` : baseClassName
}
