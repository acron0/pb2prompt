import { z } from "zod"

export const ParentSchema = z.union([
  z.object({
    component: z.object({
      id: z.string()
    })
  }),
  z.object({
    product: z.object({
      id: z.string()
    })
  }),
  z.object({
    feature: z.object({
      id: z.string()
    })
  })
])
