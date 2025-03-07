import type { Effect } from "effect"
import { Context } from "effect"
import type { Product } from "src/modules/productboard-adapter/entities/product.js"
import type { PromptWriterError } from "src/modules/prompt-writer/error.js"

export type PromptWriter = {
  write: (
    args: { title: string; description: string; products: ReadonlyArray<Product> }
  ) => Effect.Effect<string, PromptWriterError>
}

export const PromptWriter = Context.GenericTag<PromptWriter>("PromptWriter")
