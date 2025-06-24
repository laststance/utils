import { expectType } from 'ts-expect'

type A = { a: string; b: number }
type B = { a: string; b: number; c: boolean }
type C = { a: string; b: number; c: boolean; d: string }

type ABC = A | B | C

type withoutA = DistributiveOmit<ABC, 'a'>

test('DistributiveOmit', () => {
  expectType<withoutA>({ b: 1, c: true, d: 'str' })
  //@ts-expect-error 'a' does not exist in type 'withoutA'
  expectType<withoutA>({ a: 'unexpected', b: 1, c: true, d: 'str' })
  //@ts-expect-error Property 'b' is missing in type '{ c: true; d: string; }' but required in type 'Omit<C, "a">'
  expectType<withoutA>({ c: true, d: 'str' })
  expectType<withoutA>({ c: true, b: 10 })
  expectType<withoutA>({ b: 10 })
})
