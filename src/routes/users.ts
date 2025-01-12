import express from "express";
import { getCurrentUser, updateUserInfo } from "#controllers/users";
import auth from "#middlewares/auth";
// import { validateUserUpdate } from "#middlewares/validation";

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, /* validateUserUpdate, */ updateUserInfo);

export default router;
