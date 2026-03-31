import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  parseISO,
  startOfWeek,
  subDays,
} from 'date-fns'

const ACTIVITY_LOG_FILENAME = 'i-write-code-activity.json'
const CATEGORY_ORDER = [
  'laststance-repo',
  'web-ui',
  'mdn-javascript-api',
  'library-internals',
  'python-rust',
] as const
const DEFAULT_HEATMAP_WEEKS = 26
const DAYS_PER_WEEK = 7
const MAX_CONTRIBUTION_LEVEL = 4
const RECENT_SESSION_LIMIT = 6
const WEEK_STARTS_ON = 1 as const

type ActivityCategory = (typeof CATEGORY_ORDER)[number]

type ActivityEntry = {
  id: string
  date: string
  category: ActivityCategory
  taskTitle: string
  context: string
  repository: string
  effortMinutes: number
  contributionLevel: number
  outcome: string
  learned: string[]
  nextIdea: string
}

type CategorySummary = {
  category: ActivityCategory
  label: string
  count: number
}

type HeatmapDay = {
  date: string
  shortLabel: string
  accessibleLabel: string
  contributionLevel: number
  sessionCount: number
  totalEffortMinutes: number
  isToday: boolean
}

type HeatmapWeek = {
  id: string
  monthLabel: string
  days: HeatmapDay[]
}

type DashboardStats = {
  totalSessions: number
  activeDays: number
  currentStreak: number
  longestStreak: number
  totalEffortMinutes: number
}

export type IWriteCodeDashboardData = {
  entries: ActivityEntry[]
  recentEntries: ActivityEntry[]
  stats: DashboardStats
  categorySummaries: CategorySummary[]
  heatmapWeeks: HeatmapWeek[]
  learningHighlights: string[]
  activityFilePath: string
}

/**
 * Loads the local i-write-code activity log and converts it into dashboard-ready data.
 *
 * The dashboard stays resilient even when the file is missing or partially invalid by
 * returning an empty state instead of throwing an error.
 */
export async function getIWriteCodeDashboardData(): Promise<IWriteCodeDashboardData> {
  const activityFilePath = resolveActivityFilePath()
  const entries = await loadActivityEntries(activityFilePath)

  return {
    entries,
    recentEntries: entries.slice(0, RECENT_SESSION_LIMIT),
    stats: buildDashboardStats(entries),
    categorySummaries: buildCategorySummaries(entries),
    heatmapWeeks: buildHeatmapWeeks(entries, new Date()),
    learningHighlights: buildLearningHighlights(entries),
    activityFilePath,
  }
}

/**
 * Resolves the most useful local file path for the activity log.
 *
 * Development runs may start from the package directory or the monorepo root, while the
 * Docker image mounts data under `/app/data`. This helper keeps all three cases aligned.
 */
export function resolveActivityFilePath(): string {
  const configuredFilePath = process.env.I_WRITE_CODE_ACTIVITY_FILE

  if (configuredFilePath) {
    return configuredFilePath
  }

  return path.join(process.cwd(), 'data', ACTIVITY_LOG_FILENAME)
}

/**
 * Reads and normalizes activity entries from disk.
 */
async function loadActivityEntries(
  activityFilePath: string,
): Promise<ActivityEntry[]> {
  const candidateFilePaths = buildCandidateFilePaths(activityFilePath)

  for (const filePath of candidateFilePaths) {
    try {
      const rawContent = await readFile(filePath, 'utf8')
      const parsedContent = JSON.parse(rawContent) as unknown
      return normalizeEntries(parsedContent)
    } catch (error) {
      if (!isMissingFileError(error)) {
        return []
      }
    }
  }

  return []
}

/**
 * Builds a list of fallback paths for local and container-based execution.
 */
function buildCandidateFilePaths(activityFilePath: string): string[] {
  const fallbackFilePath = path.join(
    process.cwd(),
    'packages',
    'next-react',
    'data',
    ACTIVITY_LOG_FILENAME,
  )

  return Array.from(new Set([activityFilePath, fallbackFilePath]))
}

/**
 * Converts unknown JSON input into validated dashboard entries.
 */
function normalizeEntries(input: unknown): ActivityEntry[] {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .map(normalizeEntry)
    .filter((entry): entry is ActivityEntry => entry !== null)
    .sort(
      (leftEntry, rightEntry) =>
        rightEntry.date.localeCompare(leftEntry.date) ||
        rightEntry.id.localeCompare(leftEntry.id),
    )
}

/**
 * Validates a single JSON item from the activity file.
 */
function normalizeEntry(input: unknown): ActivityEntry | null {
  if (typeof input !== 'object' || input === null) {
    return null
  }

  const entry = input as Record<string, unknown>
  const category = normalizeCategory(entry.category)
  const date = normalizeDate(entry.date)
  const learned = normalizeLearned(entry.learned)

  if (
    !category ||
    !date ||
    !isNonEmptyString(entry.id) ||
    !isNonEmptyString(entry.taskTitle) ||
    !isNonEmptyString(entry.context) ||
    !isNonEmptyString(entry.repository) ||
    !isNonEmptyString(entry.outcome)
  ) {
    return null
  }

  return {
    id: entry.id,
    date,
    category,
    taskTitle: entry.taskTitle,
    context: entry.context,
    repository: entry.repository,
    effortMinutes: normalizeEffortMinutes(entry.effortMinutes),
    contributionLevel: normalizeContributionLevel(entry.contributionLevel),
    outcome: entry.outcome,
    learned,
    nextIdea: normalizeOptionalText(entry.nextIdea),
  }
}

/**
 * Builds top-level summary cards for the dashboard.
 */
function buildDashboardStats(entries: ActivityEntry[]): DashboardStats {
  const uniqueActiveDays = extractSortedActiveDays(entries)

  return {
    totalSessions: entries.length,
    activeDays: uniqueActiveDays.length,
    currentStreak: calculateCurrentStreak(uniqueActiveDays, new Date()),
    longestStreak: calculateLongestStreak(uniqueActiveDays),
    totalEffortMinutes: entries.reduce(
      (totalEffortMinutes, entry) => totalEffortMinutes + entry.effortMinutes,
      0,
    ),
  }
}

/**
 * Aggregates session counts by category for the sidebar-style summary list.
 */
function buildCategorySummaries(entries: ActivityEntry[]): CategorySummary[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    count: entries.filter((entry) => entry.category === category).length,
  })).filter((summary) => summary.count > 0)
}

/**
 * Creates the GitHub-like contribution grid for the last several weeks.
 */
function buildHeatmapWeeks(
  entries: ActivityEntry[],
  today: Date,
): HeatmapWeek[] {
  const dailySummaries = buildDailySummaries(entries)
  const calendarStart = startOfWeek(
    subDays(today, DEFAULT_HEATMAP_WEEKS * DAYS_PER_WEEK - 1),
    { weekStartsOn: WEEK_STARTS_ON },
  )
  const calendarEnd = endOfWeek(today, { weekStartsOn: WEEK_STARTS_ON })
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })
  const heatmapDays = calendarDays.map((date) =>
    buildHeatmapDay(
      date,
      today,
      dailySummaries.get(format(date, 'yyyy-MM-dd')),
    ),
  )

  return chunkHeatmapDays(heatmapDays)
}

/**
 * Combines repeated sessions from the same day into a single heatmap cell summary.
 */
function buildDailySummaries(
  entries: ActivityEntry[],
): Map<string, { level: number; count: number; minutes: number }> {
  const summaries = new Map<
    string,
    { level: number; count: number; minutes: number }
  >()

  for (const entry of entries) {
    const existingSummary = summaries.get(entry.date)
    const nextSummary = {
      level: Math.max(existingSummary?.level ?? 0, entry.contributionLevel),
      count: (existingSummary?.count ?? 0) + 1,
      minutes: (existingSummary?.minutes ?? 0) + entry.effortMinutes,
    }

    summaries.set(entry.date, nextSummary)
  }

  return summaries
}

/**
 * Converts a calendar date into a display-ready heatmap cell.
 */
function buildHeatmapDay(
  date: Date,
  today: Date,
  summary?: { level: number; count: number; minutes: number },
): HeatmapDay {
  return {
    date: format(date, 'yyyy-MM-dd'),
    shortLabel: format(date, 'EEE'),
    accessibleLabel: format(date, 'PPP'),
    contributionLevel: summary?.level ?? 0,
    sessionCount: summary?.count ?? 0,
    totalEffortMinutes: summary?.minutes ?? 0,
    isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
  }
}

/**
 * Splits daily cells into week columns for the GitHub-like layout.
 */
function chunkHeatmapDays(days: HeatmapDay[]): HeatmapWeek[] {
  const weeks: HeatmapWeek[] = []

  for (let offset = 0; offset < days.length; offset += DAYS_PER_WEEK) {
    const weekDays = days.slice(offset, offset + DAYS_PER_WEEK)
    if (weekDays.length === 0) {
      continue
    }

    const firstDay = weekDays[0]!
    const monthAnchor =
      weekDays.find((day) => day.date.endsWith('-01')) ?? firstDay

    weeks.push({
      id: firstDay.date,
      monthLabel: format(parseISO(monthAnchor.date), 'MMM'),
      days: weekDays,
    })
  }

  return weeks
}

/**
 * Extracts a compact list of frequently repeated learnings.
 */
function buildLearningHighlights(entries: ActivityEntry[]): string[] {
  const frequencyMap = new Map<string, number>()

  for (const entry of entries) {
    for (const learnedItem of entry.learned) {
      const normalizedItem = learnedItem.trim()
      if (!normalizedItem) {
        continue
      }

      frequencyMap.set(
        normalizedItem,
        (frequencyMap.get(normalizedItem) ?? 0) + 1,
      )
    }
  }

  return Array.from(frequencyMap.entries())
    .sort(
      (leftItem, rightItem) =>
        rightItem[1] - leftItem[1] || leftItem[0].localeCompare(rightItem[0]),
    )
    .slice(0, 5)
    .map(([item]) => item)
}

/**
 * Returns active days in ascending order so streak logic stays easy to follow.
 */
function extractSortedActiveDays(entries: ActivityEntry[]): Date[] {
  return Array.from(new Set(entries.map((entry) => entry.date)))
    .sort()
    .map((date) => parseISO(date))
}

/**
 * Calculates the current streak, allowing yesterday as the latest unbroken day.
 */
function calculateCurrentStreak(activeDays: Date[], today: Date): number {
  const latestActiveDay = activeDays.at(-1)

  if (!latestActiveDay) {
    return 0
  }

  const gapFromToday = differenceInCalendarDays(today, latestActiveDay)

  if (gapFromToday > 1) {
    return 0
  }

  let streak = 1

  for (let index = activeDays.length - 1; index > 0; index -= 1) {
    const currentDay = activeDays[index]
    const previousDay = activeDays[index - 1]

    if (!currentDay || !previousDay) {
      continue
    }

    if (differenceInCalendarDays(currentDay, previousDay) !== 1) {
      break
    }

    streak += 1
  }

  return streak
}

/**
 * Calculates the longest historical streak of active coding days.
 */
function calculateLongestStreak(activeDays: Date[]): number {
  if (activeDays.length === 0) {
    return 0
  }

  let longestStreak = 1
  let currentStreak = 1

  for (let index = 1; index < activeDays.length; index += 1) {
    const currentDay = activeDays[index]
    const previousDay = activeDays[index - 1]

    if (!currentDay || !previousDay) {
      continue
    }

    if (differenceInCalendarDays(currentDay, previousDay) === 1) {
      currentStreak += 1
      longestStreak = Math.max(longestStreak, currentStreak)
      continue
    }

    currentStreak = 1
  }

  return longestStreak
}

/**
 * Checks whether the current error simply means the file has not been created yet.
 */
function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

/**
 * Validates category values from user-managed JSON.
 */
function normalizeCategory(input: unknown): ActivityCategory | null {
  return typeof input === 'string' &&
    CATEGORY_ORDER.includes(input as ActivityCategory)
    ? (input as ActivityCategory)
    : null
}

/**
 * Converts a date-like input into the normalized dashboard date format.
 */
function normalizeDate(input: unknown): string | null {
  if (!isNonEmptyString(input)) {
    return null
  }

  try {
    return format(parseISO(input), 'yyyy-MM-dd')
  } catch {
    return null
  }
}

/**
 * Normalizes a list of learned points into short text bullets.
 */
function normalizeLearned(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .filter(isNonEmptyString)
    .map((item) => item.trim())
    .slice(0, 3)
}

/**
 * Converts optional text input into a safe dashboard value.
 */
function normalizeOptionalText(input: unknown): string {
  return isNonEmptyString(input) ? input.trim() : ''
}

/**
 * Converts effort input into a positive minute count.
 */
function normalizeEffortMinutes(input: unknown): number {
  return typeof input === 'number' && Number.isFinite(input) && input > 0
    ? Math.round(input)
    : 0
}

/**
 * Clamps contribution levels so the heatmap always uses the expected five-step scale.
 */
function normalizeContributionLevel(input: unknown): number {
  if (typeof input !== 'number' || !Number.isFinite(input)) {
    return 0
  }

  return Math.min(MAX_CONTRIBUTION_LEVEL, Math.max(0, Math.round(input)))
}

/**
 * Checks whether an unknown value is a usable non-empty string.
 */
function isNonEmptyString(input: unknown): input is string {
  return typeof input === 'string' && input.trim().length > 0
}

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  'laststance-repo': 'Laststance Repo',
  'web-ui': 'Web UI',
  'mdn-javascript-api': 'MDN JavaScript API',
  'library-internals': 'Library Internals',
  'python-rust': 'Python / Rust',
}
