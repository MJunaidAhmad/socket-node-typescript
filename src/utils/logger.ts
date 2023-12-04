import * as winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { logLevel } from "./config";

const GoogleCloudLogging = new LoggingWinston({
  redirectToStdout: true,
  level: logLevel,
  useMessageField: false,
});

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(winston.format.splat(), winston.format.timestamp(), winston.format.json()),
  transports: [GoogleCloudLogging],
  exceptionHandlers: [new winston.transports.Console({ level: "error" })],
  exitOnError: false,
});

export { logger };
