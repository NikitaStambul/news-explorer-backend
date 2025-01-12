import { statusCodes } from "@utils/constants";

export default class ConflictError extends Error {
  statusCode = statusCodes.CONFLICT;

  constructor(message: string) {
    super(message);
  }
}
