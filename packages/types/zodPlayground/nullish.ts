import z from 'zod'

const schema = z
  .object({
    nameList: z.array(z.string()),
    age: z.number().gt(10, { message: 'age should be greater than 10' }),
  })
  .nullish()

const res = schema.safeParse({ age: 9 })

if (!res.success) {
  console.log(res.error.flatten().fieldErrors)
}
