import { initTracing, shutdownTracing } from "./utils/tracing";
import { server } from "./server";
import { port } from "./utils/config";
import { logger } from "./utils/logger";

/**
 * Per https://opentelemetry.io/blog/2022/troubleshooting-nodejs/#enable-before-require
 *
 * All instrumentations are designed such that you first need to enable them and only then require the instrumented package.
 * A common mistake is to require packages before enabling the instrumentation libraries for them.
 */
initTracing();

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

function shutdown() {
  logger.info("Shutdown initiated");
  server
    .close()
    .then(shutdownTracing)
    .then(() => {
      logger.info("Resources released");
      logger.end();
      logger.on("end", () => {
        process.exit(0);
      });
    });
}

server.listen(
  {
    port: port,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`Server is listening at ${address}`);
  }
);
