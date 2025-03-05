import { Data } from "effect"

export class PromptWriterError extends Data.TaggedError("PromptWriterError")<{
  error: unknown
  message: string
}> {}
