import { Effect, Layer } from "effect"
import { pipe } from "remeda"
import { PromptWriterError } from "src/modules/prompt-writer/error.js"
import { PromptWriter } from "src/modules/prompt-writer/interface.js"
import { addBulletList, addEmptyLine, addHeading, addParagraph, addTitle } from "src/modules/prompt-writer/lib.js"

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
          addHeading("Products"),
          addParagraph("These are the products in our portfolio:"),
          addBulletList(products.map((p) => p.name)),
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
