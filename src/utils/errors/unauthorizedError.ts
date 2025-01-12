import { statusCodes } from "#utils/constants";

export default class UnauthorizedError extends Error {
  statusCode = statusCodes.UNAUTHORIZED;

  constructor(message: string) {
    super(message);
  }
}
