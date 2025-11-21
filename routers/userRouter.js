import express from "express";
import {createUser, getUser, loginUser, googleLogin, sendOTP, resetPassword, getAllUsers, deleteUser, updateUser, getUserGrowth,} from "../controller/userController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/", createUser);
userRouter.get("/", getUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin);
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);

// Admin routes
userRouter.get("/all", getAllUsers);   
userRouter.delete("/:id", deleteUser); 
userRouter.put("/:id", updateUser);   
userRouter.get("/growth/monthly", getUserGrowth); 

export default userRouter;
