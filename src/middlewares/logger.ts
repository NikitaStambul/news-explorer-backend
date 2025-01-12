import winston from "winston";
import expressWinston from "express-winston";

const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, meta, timestamp }) => {
    const errorStack = (meta as { error?: { stack?: string } }).error?.stack;
    return `${timestamp} ${level}: ${errorStack || message}`;
  })
);

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(),
    }),
  ],
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: "error.log",
    }),
  ],
  format: winston.format.json(),
});
