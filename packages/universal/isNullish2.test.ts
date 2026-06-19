import { describe, expect, it } from 'vitest'

import { isNullish2 } from './isNullish2'

describe('isNullish2', () => {
  it('true is not nullish', () => {
    expect(isNullish2(true)).toBe(false)
  })
})
