import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { getIWriteCodeDashboardData } from '@/lib/i-write-code/activity'

const FIXTURE_ACTIVITY_FILE = path.resolve(
  import.meta.dirname,
  '../../data/i-write-code-activity.json',
)
const MISSING_ACTIVITY_FILE = path.resolve(
  import.meta.dirname,
  '../../data/i-write-code-activity.missing.json',
)

/**
 * Builds deterministic dashboard expectations from a fixture activity file.
 */
describe('getIWriteCodeDashboardData', () => {
  afterEach(() => {
    delete process.env.I_WRITE_CODE_ACTIVITY_FILE
    vi.useRealTimers()
  })

  it('creates metrics, categories, and heatmap data from the local activity log', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-24T12:00:00.000Z'))
    process.env.I_WRITE_CODE_ACTIVITY_FILE = FIXTURE_ACTIVITY_FILE

    const dashboardData = await getIWriteCodeDashboardData()

    expect(dashboardData.stats).toEqual({
      totalSessions: 6,
      activeDays: 6,
      currentStreak: 2,
      longestStreak: 2,
      totalEffortMinutes: 250,
    })
    expect(dashboardData.categorySummaries).toEqual([
      {
        category: 'laststance-repo',
        label: 'Laststance Repo',
        count: 1,
      },
      {
        category: 'web-ui',
        label: 'Web UI',
        count: 1,
      },
      {
        category: 'mdn-javascript-api',
        label: 'MDN JavaScript API',
        count: 2,
      },
      {
        category: 'library-internals',
        label: 'Library Internals',
        count: 1,
      },
      {
        category: 'python-rust',
        label: 'Python / Rust',
        count: 1,
      },
    ])
    expect(dashboardData.recentEntries[0]?.id).toBe('2026-03-24-mdn-array-from')
    expect(dashboardData.learningHighlights).toContain('array-like vs iterable')
    expect(
      dashboardData.heatmapWeeks.some((week) =>
        week.days.some(
          (day) => day.date === '2026-03-24' && day.contributionLevel === 3,
        ),
      ),
    ).toBe(true)
  })

  it('returns an empty dashboard state when the log file is missing', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-24T12:00:00.000Z'))
    process.env.I_WRITE_CODE_ACTIVITY_FILE = MISSING_ACTIVITY_FILE

    const dashboardData = await getIWriteCodeDashboardData()

    expect(dashboardData.stats.totalSessions).toBe(0)
    expect(dashboardData.recentEntries).toEqual([])
    expect(dashboardData.categorySummaries).toEqual([])
  })
})
