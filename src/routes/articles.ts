import express from "express";
import auth from "#middlewares/auth";
import { getArticles, saveArticle } from "#controllers/articles";

const router = express.Router();

router.get("/", getArticles);
router.post("/", auth, saveArticle);

export default router;
