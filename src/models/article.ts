import mongoose, { Schema, Document, Model } from "mongoose";
import { Article } from "#types/newsapi";

export interface IArticle extends Article, Document {
  _id: mongoose.Types.ObjectId;
  keyword: string;
}

type ArticleModel = Model<IArticle>;

const articleSchema = new Schema<IArticle, ArticleModel>({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  source: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
  },
  author: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  url: {
    type: String,
    required: true,
  },
  urlToImage: {
    type: String,
    default: null,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: null,
  },
});

const Article = mongoose.model<IArticle, ArticleModel>(
  "Article",
  articleSchema
);

export default Article;
