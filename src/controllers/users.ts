import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Omit } from "utility-types";
import User, { IUser } from "@models/user";
import NotFoundError from "@utils/errors/notFoundError";
import BadRequestError from "@utils/errors/badRequestError";
import ConflictError from "@utils/errors/conflictError";
import UnauthorizedError from "@utils/errors/unauthorizedError";
import { JWT_SECRET } from "@utils/config";
import { statusCodes } from "@utils/constants";
import { AuthenticatedRequest } from "@middlewares/auth";

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const getCurrentUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  User.findById(req.user?._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError(`User with id: ${req.user?._id} not found`));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong userId format"));
      } else {
        next(error);
      }
    });
};

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10).then((hashedPassword) => {
    User.create({ username, email, password: hashedPassword })
      .then((user) => {
        const userWithoutPassword: MakeOptional<IUser, "password"> =
          user.toObject();
        delete userWithoutPassword.password;

        res.status(statusCodes.CREATED).send(userWithoutPassword);
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          next(new BadRequestError("Data is not valid"));
        } else if (error.code === 11000) {
          next(new ConflictError("User with this email already exists"));
        } else {
          next(error);
        }
      });
  });
};

export const updateUserInfo = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const { username } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { username },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError(`User with id: ${req.user?._id} not found`));
        return;
      }

      res.send(updatedUser);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Data is not valid"));
      } else if (error.name === "CastError") {
        next(new BadRequestError("Wrong userId format"));
      } else {
        next(error);
      }
    });
};

export const login = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email or password are not provided"));
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((error) => {
      if (error.name === "CredentialsError") {
        next(new UnauthorizedError("Email or password are incorrect"));
      } else {
        next(error);
      }
    });
};
