import { test, expectTypeOf } from 'vitest'

import type { ValueOf } from './value-of'

const STATUS = {
  OK: 200,
  NOT_FOUND: 404,
} as const

test('ValueOf extracts object value union', () => {
  expectTypeOf<ValueOf<typeof STATUS>>().toEqualTypeOf<200 | 404>()
})
