import newsApi from "#api/newsApi";
import { AuthenticatedRequest } from "#middlewares/auth";
import User from "#models/user";
import { statusCodes } from "#utils/constants";
import BadRequestError from "#utils/errors/badRequestError";
import NotFoundError from "#utils/errors/notFoundError";
import { NextFunction, Request, Response } from "express";

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return next(
        new BadRequestError(
          "Query parameter is required and must be a non-empty string"
        )
      );
    }

    const articles = await newsApi.getArticles(query);
    res.send({ articles });
  } catch (error) {
    next(error);
  }
};

export const saveArticle = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { article } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return next(new BadRequestError("User ID is required"));
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const isBookmarked = user.bookmarked.some(
      (savedArticle) => savedArticle.url === article.url
    );

    if (isBookmarked) {
      res
        .status(statusCodes.OK)
        .send({ message: "Article is already bookmarked" });

      return;
    }

    user.bookmarked.unshift(article);
    await user.save();

    res.status(statusCodes.CREATED).send({
      message: "Article saved and bookmarked",
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const removeArticle = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { url } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return next(new BadRequestError("User ID is required"));
  }

  if (!url || typeof url !== "string") {
    return next(new BadRequestError("URL is required and must be a string"));
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const initialLength = user.bookmarked.length;
    user.bookmarked = user.bookmarked.filter((article) => article.url !== url);

    if (user.bookmarked.length === initialLength) {
      return next(new NotFoundError("Article not found in bookmarks"));
    }

    await user.save();

    res
      .status(statusCodes.OK)
      .send({ message: "Article removed from bookmarks" });
  } catch (error) {
    next(error);
  }
};
