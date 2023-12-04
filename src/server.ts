import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import { router } from "./routes";
import { logger } from "./utils/logger";
import { init, shutdown } from "./routes/v1/notifications";

init();

export const server: FastifyInstance = Fastify({
  // pluginTimeout: 30000,

  // We rely on readiness probe to stop accepting traffic - https://github.com/fastify/fastify/issues/1714
  return503OnClosing: false,
});

// Register CORS plugin prior to everything else, so it would have precedence
server.register(fastifyCors, {
  origin: [/domain\.dev$/, "http://localhost:3000", "http://127.0.0.1:8080"],
  exposedHeaders: ["retry-after"],
  maxAge: 24 * 60 * 60,
  strictPreflight: true,
});

// server.register(identityAwareProxyAuthN);

server.register(websocketPlugin, {
  logLevel: "trace",
});

server.register(router, { prefix: "/notifications" });

server.addHook("onReady", () => {
  logger.info("Ready to accept traffic");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.addHook("onClose", async (instance) => {
  shutdown();
});
