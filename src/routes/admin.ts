import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

/**
 * Responds with HTTP Status 200
 *
 * @param fastify
 */
export async function pingCtl(fastify: FastifyInstance) {
  await fastify.get("/ping", ping);
}

// eslint-disable-next-line require-await
async function ping(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  reply.send({ msg: "pong" });
}

// eslint-disable-next-line require-await
// export async function authCtl(fastify: FastifyInstance) {
//   // eslint-disable-next-line require-await
//   await fastify.get("/auth", auth);
// }

// eslint-disable-next-line require-await
// async function auth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   reply.send(request.callerId);
// }
