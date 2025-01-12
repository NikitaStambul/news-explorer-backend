import { statusCodes } from "@utils/constants";

export default class ForbiddenError extends Error {
  statusCode = statusCodes.FORBIDDEN;

  constructor(message: string) {
    super(message);
  }
}
