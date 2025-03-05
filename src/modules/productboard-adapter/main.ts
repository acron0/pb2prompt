import { HttpClient } from "@effect/platform"
import { Config, Effect, Layer } from "effect"
import { parseWithSchema } from "src/lib/zod.js"
import { ProductSchema } from "src/modules/productboard-adapter/entities/product.js"
import { ProductboardAdapterError } from "src/modules/productboard-adapter/error.js"
import { ProductboardAdapter } from "src/modules/productboard-adapter/interface.js"

const baseUri = "https://api.productboard.com"
const routes = { products: "/products" }
type RouteKeys = keyof typeof routes

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
          Effect.andThen((response) =>
            Effect.zip(Effect.succeed(response.status), response.json.pipe(Effect.map((j: any) => j.data)))
          )
        )

        if (status !== 200) {
          return yield* new ProductboardAdapterError({
            error: null,
            message: `GET request to ${uri} failed with status ${status}`
          })
        } else return result
      })

    const products: ProductboardAdapter["products"] = () =>
      Effect.gen(function*() {
        return yield* get("products").pipe(
          Effect.andThen((result) => parseWithSchema(ProductSchema.array(), result))
        )
      }).pipe(
        Effect.catchAll((error) => new ProductboardAdapterError({ error, message: "Failed to fetch products" })),
        Effect.scoped
      )
    return ProductboardAdapter.of({
      products
    })
  })
)
