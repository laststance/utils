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
  //@ts-expect-error 'id' maps to never in $Exact<User, ...>
  expectType<$Exact<User, { name: string; age: number; id: number }>>({
    name: 'Alice',
    age: 30,
    id: 1,
  })
})

test('Exact rejects multiple excess properties', () => {
  //@ts-expect-error 'id' and 'role' map to never in $Exact<User, ...>
  expectType<
    $Exact<User, { name: string; age: number; id: number; role: string }>
  >({ name: 'Alice', age: 30, id: 1, role: 'admin' })
})

test('Exact preserves optional properties', () => {
  expectType<$Exact<WithOptional, { name: string }>>({ name: 'Alice' })
  expectType<$Exact<WithOptional, { name: string; bio: string }>>({
    name: 'Alice',
    bio: 'Hello',
  })
})

test('Exact rejects excess on types with optional properties', () => {
  //@ts-expect-error 'role' maps to never in $Exact<WithOptional, ...>
  expectType<$Exact<WithOptional, { name: string; role: string }>>({
    name: 'Alice',
    role: 'admin',
  })
})

test('Exact rejects object missing required properties', () => {
  //@ts-expect-error Property 'age' is missing
  expectType<$Exact<User, { name: string }>>({ name: 'Alice' })
})
