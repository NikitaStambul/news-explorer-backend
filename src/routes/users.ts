import express from "express";
import { getCurrentUser, updateUserInfo } from "#controllers/users";
import auth from "#middlewares/auth";

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserInfo);

export default router;
