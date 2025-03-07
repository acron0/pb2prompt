import { z } from "zod"

export const OwnerSchema = z.union([
  z.object({
    email: z.string().email()
  }),
  z.literal("[obfuscated]")
]).nullable()
