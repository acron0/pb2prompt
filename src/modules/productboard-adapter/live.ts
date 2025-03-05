import { FetchHttpClient } from "@effect/platform"
import { Layer } from "effect"
import { ProductboardAdapterLayer } from "src/modules/productboard-adapter/main.js"

export const ProductboardAdapterLayerLive = ProductboardAdapterLayer.pipe(
  Layer.provide(FetchHttpClient.layer)
)
