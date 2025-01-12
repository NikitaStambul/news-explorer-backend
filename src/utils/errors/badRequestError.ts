import { statusCodes } from "@utils/constants";

export default class BadRequestError extends Error {
  statusCode = statusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}
