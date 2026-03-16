import { z } from 'zod'

const objSchema = z.object({
  name: z.string().nullable(),
  age: z.number().nullable(),
})

const res = objSchema.safeParse({ name: null, age: null })

if (res.success) {
  console.log('success')
}
