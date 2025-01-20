import express from "express";
import users from "#routes/users";
import articles from "#routes/articles";
import { createUser, login } from "#controllers/users";

const router = express.Router();
router.use("/users", users);
router.use("/articles", articles);

router.post("/signin", login);
router.post("/signup", createUser);

export default router;
