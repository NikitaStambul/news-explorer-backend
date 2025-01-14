import express from "express";
import auth from "#middlewares/auth";
import { getArticles, removeArticle, saveArticle } from "#controllers/articles";

const router = express.Router();

router.get("/", getArticles);
router.post("/", auth, saveArticle);
router.delete("/", auth, removeArticle);

export default router;
