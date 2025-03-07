import { HttpClient } from "@effect/platform"
import { Chunk, Config, Effect, Layer, Option, Stream } from "effect"
import { parseWithSchema } from "src/lib/zod.js"
import {
  ComponentArraySchema,
  FeatureArraySchema,
  ProductArraySchema
} from "src/modules/productboard-adapter/entities/index.js"
import { ProductboardAdapterError } from "src/modules/productboard-adapter/error.js"
import { ProductboardAdapter } from "src/modules/productboard-adapter/interface.js"

const baseUri = "https://api.productboard.com"
const routes = { products: "/products", components: "/components", features: "/features" }
type RouteKeys = keyof typeof routes

type NextLinkType = string | undefined

export const ProductboardAdapterLayer = Layer.effect(
  ProductboardAdapter,
  Effect.gen(function*() {
    const client = yield* HttpClient.HttpClient

    const get = (route: RouteKeys) =>
      Effect.gen(function*() {
        const token = yield* Config.string("productboard_token")
        const uri = `${baseUri}${routes[route]}`
        const headers = {
          "Authorization": `Bearer ${token}`,
          "X-Version": "1"
        }
        const [status, result] = yield* client.get(uri, { headers }).pipe(
          Effect.andThen((response) => Effect.zip(Effect.succeed(response.status), response.json))
        )

        if (status !== 200) {
          return yield* new ProductboardAdapterError({
            error: null,
            message: `GET request to ${uri} failed with status ${status}`
          })
        } else return result
      })

    const productsInternal = get("products").pipe(
      Effect.andThen((result) => parseWithSchema(ProductArraySchema, result)),
      Effect.scoped
    )

    const componentsInternal = get("components").pipe(
      Effect.andThen((result) => parseWithSchema(ComponentArraySchema, result)),
      Effect.scoped
    )

    const featuresInternal = get("features").pipe(
      Effect.andThen((result) => parseWithSchema(FeatureArraySchema, result)),
      Effect.scoped
    )

    const products: ProductboardAdapter["products"] = () =>
      Stream.paginateChunkEffect(undefined as NextLinkType, (nextLink) =>
        Effect.gen(function*() {
          const result = yield* (nextLink === undefined
            ? productsInternal
            : Effect.succeed({ data: [], links: { next: undefined } }))
          const nextLinkValue: NextLinkType = result.links.next || undefined
          return [
            Chunk.fromIterable(result.data),
            nextLinkValue === undefined ? Option.none<NextLinkType>() : Option.some(nextLinkValue)
          ]
        })).pipe(
          Stream.catchAll((error) => new ProductboardAdapterError({ error, message: "Failed to fetch products" })),
          Stream.withSpan("ProductboardAdapterLayer.products")
        )

    const components: ProductboardAdapter["components"] = () =>
      Stream.paginateChunkEffect(undefined as NextLinkType, (nextLink) =>
        Effect.gen(function*() {
          const result = yield* (nextLink === undefined
            ? componentsInternal
            : Effect.succeed({ data: [], links: { next: undefined } }))
          const nextLinkValue: NextLinkType = result.links.next || undefined
          return [
            Chunk.fromIterable(result.data),
            nextLinkValue === undefined ? Option.none<NextLinkType>() : Option.some(nextLinkValue)
          ]
        })).pipe(
          Stream.catchAll((error) => new ProductboardAdapterError({ error, message: "Failed to fetch components" })),
          Stream.withSpan("ProductboardAdapterLayer.components")
        )

    const features: ProductboardAdapter["features"] = () =>
      Stream.paginateChunkEffect(undefined as NextLinkType, (nextLink) =>
        Effect.gen(function*() {
          const result = yield* (nextLink === undefined
            ? featuresInternal
            : Effect.succeed({ data: [], links: { next: undefined } }))
          const nextLinkValue: NextLinkType = result.links.next || undefined
          return [
            Chunk.fromIterable(result.data),
            nextLinkValue === undefined ? Option.none<NextLinkType>() : Option.some(nextLinkValue)
          ]
        })).pipe(
          Stream.catchAll((error) => new ProductboardAdapterError({ error, message: "Failed to fetch features" })),
          Stream.withSpan("ProductboardAdapterLayer.features")
        )

    return ProductboardAdapter.of({
      products,
      components,
      features
    })
  })
)
