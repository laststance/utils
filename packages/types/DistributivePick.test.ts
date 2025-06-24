import { expectType } from 'ts-expect'

type A = { a: string; b: number }
type B = { a: string; b: number; c: boolean }
type C = { a: string; b: number; c: boolean; d: string }

type ABC = A | B | C

type PickA = DistributivePick<ABC, 'a'>

test('DistributivePick', () => {
  expectType<PickA>({ a: 'str' })
  //@ts-expect-error Property 'b' is missing in type '{ a: string; }' but required in type 'PickA'
  expectType<PickA>({ a: 'str', b: 1 })
  //@ts-expect-error Property 'c' is missing in type '{ a: string; }' but required in type 'PickA'
  expectType<PickA>({ a: 'str', c: true })
  //@ts-expect-error Property 'd' is missing in type '{ a: string; }' but required in type 'PickA'
  expectType<PickA>({ a: 'str', d: 'str' })
})
