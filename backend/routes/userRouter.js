import express from "express"
import {getCurrentUser, loginUser , registerUser, updateProfile, updatePassword, requestPasswordReset, resetPasswordWithToken} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/forgot-password", requestPasswordReset);
userRouter.post("/reset-password", resetPasswordWithToken);

//protected routes
userRouter.get('/me',authMiddleware,getCurrentUser);
userRouter.put("/profile",authMiddleware,updateProfile);
userRouter.put("/password",authMiddleware ,updatePassword);

export default userRouter;
