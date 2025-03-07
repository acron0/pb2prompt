import { z } from "zod"

export const LinksSchema = z.object({
  self: z.string().url(),
  html: z.string().url()
})

export const LinksNextSchema = z.object({
  next: z.string().url().nullable()
})
