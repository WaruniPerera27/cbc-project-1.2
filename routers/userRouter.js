import express from 'express';
import { createUser, loginUser } from '../controller/userController.js';

const userRouter = express.Router();
userRouter.post("/",createUser)
userRouter.post("/login", loginUser)// "login" useto identify seperately from other request because they have two post request.

export default userRouter;