import { expectType } from 'ts-expect'

type User = { name: string; age: number }
type WithOptional = { name: string; bio?: string }

test('Exact accepts object with matching properties', () => {
  expectType<$Exact<User, { name: string; age: number }>>({
    name: 'Alice',
    age: 30,
  })
})

test('Exact rejects object with excess properties', () => {
  expectType<$Exact<User, { name: string; age: number; id: number }>>({
    name: 'Alice',
    age: 30,
    // @ts-expect-error 'id' maps to never in $Exact<User, ...>
    id: 1,
  })
})

test('Exact rejects multiple excess properties', () => {
  expectType<
    $Exact<User, { name: string; age: number; id: number; role: string }>
  >({
    name: 'Alice',
    age: 30,
    // @ts-expect-error 'id' maps to never in $Exact<User, ...>
    id: 1,
    // @ts-expect-error 'role' maps to never in $Exact<User, ...>
    role: 'admin',
  })
})

test('Exact preserves optional properties', () => {
  expectType<$Exact<WithOptional, { name: string }>>({ name: 'Alice' })
  expectType<$Exact<WithOptional, { name: string; bio: string }>>({
    name: 'Alice',
    bio: 'Hello',
  })
})

test('Exact rejects excess on types with optional properties', () => {
  expectType<$Exact<WithOptional, { name: string; role: string }>>({
    name: 'Alice',
    // @ts-expect-error 'role' maps to never in $Exact<WithOptional, ...>
    role: 'admin',
  })
})

test('Exact rejects object missing required properties', () => {
  //@ts-expect-error Property 'age' is missing
  expectType<$Exact<User, { name: string }>>({ name: 'Alice' })
})
