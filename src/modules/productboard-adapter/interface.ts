import type { Stream } from "effect"
import { Context } from "effect"
import type { Component, Feature, Product } from "src/modules/productboard-adapter/entities/index.js"
import type { ProductboardAdapterError } from "src/modules/productboard-adapter/error.js"

export type ProductboardAdapter = {
  products: () => Stream.Stream<Product, ProductboardAdapterError, never>
  components: () => Stream.Stream<Component, ProductboardAdapterError, never>
  features: () => Stream.Stream<Feature, ProductboardAdapterError, never>
}

export const ProductboardAdapter = Context.GenericTag<ProductboardAdapter>("ProductboardAdapter")
