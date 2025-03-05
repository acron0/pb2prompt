import { Data } from "effect"

export class ProductboardAdapterError extends Data.TaggedError("ProductboardAdapterError")<{
  error: unknown
  message: string
}> {}
