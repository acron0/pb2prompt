import { stripHtml } from "string-strip-html"
import { z } from "zod"

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string().transform((s) => stripHtml(s).result)
})

export type Product = z.infer<typeof ProductSchema>
