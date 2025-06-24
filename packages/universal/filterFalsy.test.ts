import { filterFalsy } from './filterFalsy'

describe('filterFalsy', () => {
  it('should filter falsy values', () => {
    expect(filterFalsy([0, 1, false, 2, '', 3])).toEqual([1, 2, 3])
  })
})
