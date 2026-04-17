import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js"; // ✅ IMPORTANT

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// ✅ PROTECTED ROUTES
userRouter.post("/profile", authMiddleware, getProfile);
userRouter.post("/update", authMiddleware, updateProfile);

export default userRouter;
