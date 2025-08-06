import z from 'zod'

const schema = z.object({
  numArr: z.array(z.number()),
})
console.log(schema.safeParse({ numArr: [] }))
// { success: true, data: { numArr: [] } }

const schemaNoemptySchema = z.object({
  numArr: z.array(z.number()).nonempty(),
})
console.log(schemaNoemptySchema.safeParse({ numArr: [] }))
// { success: false, error: [Getter] }
