import { Command, Options } from "@effect/cli"
import { Chunk, ConfigProvider, Console, Effect, Logger, LogLevel, Option, Stream } from "effect"
import { ProductboardAdapter, ProductboardAdapterLayerLive } from "src/modules/productboard-adapter/index.js"
import { PromptWriter, PromptWriterLayerLive } from "src/modules/prompt-writer/index.js"

// Color codes for ANSI escape sequences
const logLevelChoices = {
  debug: LogLevel.Debug,
  info: LogLevel.Info,
  warning: LogLevel.Warning,
  error: LogLevel.Error
} as const

type SupportedLogLevel = keyof typeof logLevelChoices
const supportedLogLevel = Object.keys(logLevelChoices) as Array<SupportedLogLevel>

// Define the 'token' option with an alias '-t'
const token = Options.text("token") // .pipe(Options.withAlias("t"))

// Define the 'log-level' option with no alias
const logLevel = Options.choice("log-level", supportedLogLevel).pipe(Options.optional)

// Define the 'title' option.
const title = Options.text("title")

// Define the 'description' option.
const description = Options.text("description")

const command = Command.make(
  "pb2prompt",
  { token, logLevel, title, description },
  (args) =>
    Effect.gen(function*() {
      const { description, logLevel, title, token } = args
      const safeLogLevel = Option.match(logLevel, {
        onNone: () => LogLevel.Info,
        onSome: (logLevel) => logLevelChoices[logLevel]
      })

      // body here
      yield* Effect.gen(function*() {
        //
        const pba = yield* ProductboardAdapter
        const pw = yield* PromptWriter

        //
        const products = Chunk.toReadonlyArray(yield* Stream.runCollect(pba.products()))
        yield* Effect.annotateCurrentSpan({ products: { length: products.length } })

        const components = Chunk.toReadonlyArray(yield* Stream.runCollect(pba.components()))
        yield* Effect.annotateCurrentSpan({ components: { length: components.length } })

        const features = Chunk.toReadonlyArray(yield* Stream.runCollect(pba.features()))
        yield* Effect.annotateCurrentSpan({ features: { length: features.length } })

        //
        const markdown = yield* pw.write({ title, description, products })

        //
        yield* Console.log(markdown)
      }).pipe(
        Logger.withMinimumLogLevel(safeLogLevel),
        Effect.withConfigProvider(ConfigProvider.fromMap(
          new Map([["productboard_token", token]])
        )),
        Effect.tapError(Effect.logError)
      )
    }).pipe(
      Effect.provide(ProductboardAdapterLayerLive),
      Effect.provide(PromptWriterLayerLive),
      Effect.withSpan("pb2prompt", { attributes: { args } })
    )
)

export const run = Command.run(command, {
  name: "pb2prompt - Productboard --> Prompt",
  version: "0.0.0"
})
