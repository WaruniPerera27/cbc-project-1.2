import express from "express";
import {
  createUser,
  getUser,
  loginUser,
  googleLogin,
  sendOTP,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserGrowth,
} from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../controller/userController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin);
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);

//  Protected user route
userRouter.get("/", authMiddleware, getUser);

// Admin routes 
userRouter.get("/all", authMiddleware, getAllUsers);
userRouter.delete("/:id", authMiddleware, deleteUser);
userRouter.put("/:id", authMiddleware, updateUser);
userRouter.get("/growth/monthly", authMiddleware,isAdmin, getUserGrowth);

export default userRouter;
