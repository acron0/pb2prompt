import { Data, Effect } from "effect"
import type { ZodError, ZodType } from "zod"

export const ErrorIdZodParseError = "ZodParseError"

export class ZodParseError extends Data.TaggedError(ErrorIdZodParseError)<{
  error: ZodError
  message: string
}> {}

type ZodParseEffect<T extends ZodType<any, any>> = Effect.Effect<
  ReturnType<T["parse"]>,
  ZodParseError
>

export const parseWithSchema: {
  <T extends ZodType<any, any>>(schema: T): (data: unknown) => ZodParseEffect<T>
  <T extends ZodType<any, any>>(schema: T, data: unknown): ZodParseEffect<T>
} = <T extends ZodType<any, any>>(schema: T, data?: unknown): any => {
  const parse = (inputData: unknown): ZodParseEffect<T> =>
    Effect.try({
      try: () => schema.parse(inputData),
      catch: (error) =>
        new ZodParseError({
          error: error as ZodError,
          message: (error as ZodError).message
        })
    }).pipe(
      Effect.tap(() => Effect.annotateCurrentSpan("schema", schema)),
      Effect.withSpan("zod.parseWithSchema")
    )

  if (data === undefined) {
    return (inputData: unknown) => parse(inputData)
  } else {
    return parse(data)
  }
}
