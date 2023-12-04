import { FastifyInstance } from "fastify";
import { pingCtl } from "./admin";
import { notificationsCtl } from "./v1/notifications";

export async function router(fastify: FastifyInstance) {
  await fastify.register(pingCtl, { prefix: "/-" });

  await fastify.register(notificationsCtl, { prefix: "/v1" });
}
