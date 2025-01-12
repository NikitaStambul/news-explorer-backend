import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "@utils/errors/unauthorizedError";
import { JWT_SECRET } from "@utils/config";

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const auth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.user = payload;

    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

export default auth;
