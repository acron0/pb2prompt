import { Effect, Layer } from "effect"
import { map, pipe } from "remeda"
import { defaultString } from "src/lib/string.js"
import type { Product } from "src/modules/productboard-adapter/entities/product.js"
import { PromptWriterError } from "src/modules/prompt-writer/error.js"
import { PromptWriter } from "src/modules/prompt-writer/interface.js"
import { addBulletList, addEmptyLine, addHeading, addParagraph, addTitle } from "src/modules/prompt-writer/lib.js"

const addProducts = (products: Array<Product>) => (s: Array<string>): Array<string> => {
  const productPrompts = map(
    products,
    (product) =>
      pipe(
        [],
        addHeading(`Product: ${product.name}`),
        addParagraph(defaultString(product.description, "(No description was provided)")),
        addEmptyLine()
      ).join("\n")
  )

  return [...s, ...productPrompts]
}

export const PromptWriterLayer = Layer.effect(
  PromptWriter,
  Effect.gen(function*() {
    const write: PromptWriter["write"] = ({ description, products, title }) =>
      Effect.gen(function*() {
        const result: Array<string> = pipe(
          [],
          addTitle(title),
          addParagraph(description),
          addEmptyLine(),
          addHeading("Product Overview"),
          addParagraph("These are the products in our portfolio:"),
          addBulletList(products.map((p) => p.name)),
          addEmptyLine(),
          addProducts(products),
          addEmptyLine()
        )
        return result.join("\n")
      }).pipe(
        Effect.catchAll((error) => new PromptWriterError({ error, message: "Failed to write prompt" }))
      )

    return PromptWriter.of({
      write
    })
  })
)
