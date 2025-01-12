import { statusCodes } from "#utils/constants";

export default class NotFoundError extends Error {
  statusCode = statusCodes.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
