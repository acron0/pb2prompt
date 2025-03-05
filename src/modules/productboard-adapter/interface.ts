import type { Effect } from "effect"
import { Context } from "effect"
import type { Product } from "src/modules/productboard-adapter/entities/product.js"
import type { ProductboardAdapterError } from "src/modules/productboard-adapter/error.js"

export type ProductboardAdapter = {
  products: () => Effect.Effect<Array<Product>, ProductboardAdapterError>
}

export const ProductboardAdapter = Context.GenericTag<ProductboardAdapter>("ProductboardAdapter")
