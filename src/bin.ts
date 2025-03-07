#!/usr/bin/env node

import { DevTools } from "@effect/experimental"
import { NodeSocket } from "@effect/platform-node"
import * as NodeContext from "@effect/platform-node/NodeContext"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { Layer } from "effect"
import * as Effect from "effect/Effect"
import { run } from "./Cli.js"

const DevToolsLive = DevTools.layerWebSocket().pipe(
  Layer.provide(NodeSocket.layerWebSocketConstructor)
)

run(process.argv).pipe(
  Effect.provide(DevToolsLive),
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain({ disableErrorReporting: true })
)
