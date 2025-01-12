import newsApi from "#api/newsApi";
import { AuthenticatedRequest } from "#middlewares/auth";
import Article from "#models/article";
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
    res.send(articles);
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
    let existingArticle = await Article.findOne({ url: article.url });

    if (!existingArticle) {
      existingArticle = await Article.create(article);
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    const isBookmarked = user.bookmarked.some((articleId) =>
      articleId.equals(existingArticle._id)
    );

    if (isBookmarked) {
      res
        .status(statusCodes.OK)
        .send({ message: "Article is already bookmarked" });
      return;
    }

    user.bookmarked.push(existingArticle._id);
    await user.save();

    res.status(statusCodes.CREATED).send({
      message: "Article saved and bookmarked",
      article: existingArticle,
    });
  } catch (error) {
    next(error);
  }
};
