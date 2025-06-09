import { range } from '../array/range'

test('range', () => {
  const res = range(1, 10)
  expect(res).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})
