import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  const { statusCode = 500, message = "Something went wrong" } = err;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).send({
    message:
      isProduction && statusCode === 500
        ? "An error occurred on the server"
        : message,
    ...(isProduction ? {} : { error: err.stack }),
  });
};

export default errorHandler;
