import { LinksNextSchema, LinksSchema } from "src/modules/productboard-adapter/entities/links.js"
import { OwnerSchema } from "src/modules/productboard-adapter/entities/owner.js"
import { stripHtml } from "string-strip-html"
import { z } from "zod"

export const ProductSchema = z.object({
  name: z.string(),
  id: z.string(),
  description: z.string().transform((s) => stripHtml(s).result),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  owner: OwnerSchema,
  links: LinksSchema
})

export type Product = z.infer<typeof ProductSchema>

export const ProductArraySchema = z.object({
  data: ProductSchema.array(),
  links: LinksNextSchema
})
