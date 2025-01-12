import express from "express";
import users from "#routes/users";
import articles from "#routes/articles";
import { createUser, login } from "#controllers/users";
// import { validateLogin, validateUserCreation } from "#middlewares/validation";

const router = express.Router();
router.use("/users", users);
router.use("/articles", articles);

router.post("/signin", /* validateLogin, */ login);
router.post("/signup", /* validateUserCreation, */ createUser);

export default router;
