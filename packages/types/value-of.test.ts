import { test, expectTypeOf } from 'vitest'

import type { ValueOf } from './value-of'

test('ValueOf extracts object value union', () => {
  const STATUS = {
    OK: 200,
    NOT_FOUND: 404,
  } as const
  expectTypeOf<ValueOf<typeof STATUS>>().toEqualTypeOf<200 | 404>()

  interface User {
    id: number
    name: string
    isActive: boolean
  }

  // Interface Union
  type UserFieldTypes = ValueOf<User>

  expectTypeOf<UserFieldTypes>().toEqualTypeOf<string | number | boolean>()

  // Reload / Map extract
  type ColorMap = Record<'primary' | 'secondary' | 'danger', `#${string}`>
  type ColorValue = ValueOf<ColorMap>
  expectTypeOf<ColorValue>().toEqualTypeOf<`#${string}`>()

  // Discriminated Union
  type EventMap = {
    click: { x: number; y: number }
    keydown: { key: string }
    scroll: { offset: number }
  }
  type EventPayload = ValueOf<EventMap>

  expectTypeOf<EventPayload>().toEqualTypeOf<
    { x: number; y: number } | { key: string } | { offset: number }
  >()
})
