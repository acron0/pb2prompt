import { ParentSchema } from "src/modules/productboard-adapter/entities/parent.js"
import { stripHtml } from "string-strip-html"
import { z } from "zod"
import { LinksNextSchema, LinksSchema } from "./links.js"

export const FeatureSchema = z.object({
  name: z.string(),
  id: z.string(),
  description: z.string().transform((s) => stripHtml(s).result),
  parent: ParentSchema,
  type: z.enum(["feature", "subfeature"]),
  archived: z.boolean(),
  status: z.any(), // TODO
  links: LinksSchema,
  timeframe: z.any(), // TODO
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastHealthUpdate: z.any() // TODO
})

export type Feature = z.infer<typeof FeatureSchema>

export const FeatureArraySchema = z.object({
  data: FeatureSchema.array(),
  links: LinksNextSchema
})
