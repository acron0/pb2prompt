import { LinksNextSchema, LinksSchema } from "src/modules/productboard-adapter/entities//links.js"
import { ParentSchema } from "src/modules/productboard-adapter/entities//parent.js"
import { stripHtml } from "string-strip-html"
import { z } from "zod"
import { OwnerSchema } from "./owner.js"

export const ComponentSchema = z.object({
  name: z.string(),
  id: z.string(),
  description: z.string().transform((s) => stripHtml(s).result),
  parent: ParentSchema,
  links: LinksSchema,
  owner: OwnerSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type Component = z.infer<typeof ComponentSchema>

export const ComponentArraySchema = z.object({
  data: ComponentSchema.array(),
  links: LinksNextSchema
})
