import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SocketStream } from "@fastify/websocket";
import { StatusCodes } from "http-status-codes";
import { WebSocket } from "ws";
import { logger } from "../../utils/logger";

const sockets: Map<string, WebSocket> = new Map();

let intervalId: NodeJS.Timer;

export function init() {
  intervalId = setInterval(() => {
    sockets.forEach((socket, key) => {
      socket.send(`tick: ${key}, totalSockets: ${sockets.size}`);
    });
  }, 1_000);
}

export function shutdown() {
  if (intervalId) {
    clearInterval(intervalId);
  }
}

export async function notificationsCtl(fastify: FastifyInstance) {
  fastify.addHook("preValidation", async (req, repl) => {
    logger.debug(`Auth header: ${req.headers.authorization}`);

    if (req.headers.authorization === "term") {
      await repl.send("Unauthorized").status(StatusCodes.UNAUTHORIZED);
    }
  });

  await fastify.get(
    "/",
    {
      websocket: true,
    },
    notifications
  );
}

function notifications(connection: SocketStream, req: FastifyRequest) {
  logger.debug(`Client connected`);

  sockets.set(req.headers.authorization!, connection.socket);

  connection.socket.on("message", (message) => {
    // logger.debug(`Incoming: ${message}`);
    // connection.socket.send("hi from server");
  });

  connection.socket.on("close", () => {
    sockets.delete(req.headers.authorization!);
    logger.debug(`Client disconnected`);
  });
}
