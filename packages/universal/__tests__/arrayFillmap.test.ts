import { arrayFillmap } from '../array/arrayFilllmap'

test('run arrayFillmap', () => {
  const res = arrayFillmap(10, (v, i) => {
    return [i, v]
  })
  expect(res).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
  ])
})
