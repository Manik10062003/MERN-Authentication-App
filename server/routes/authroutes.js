import express from 'express';
import { registered, login, logout, isauthenticated, sendresetotp, resetpassword } from '../controllers/authcontroller.js';
import userAuth from '../middleware/userAuth.js';
import { verifyotp } from "../controllers/authcontroller.js";  // ✅ Ensure this import exists
import { verifyEmail } from "../controllers/authcontroller.js"; // ✅ Ensure this import exists

const authRouter = express.Router();
authRouter.post('/registered' , registered);
authRouter.post('/login' , login);
authRouter.post('/logout' , logout);
authRouter.post("/send-verify-otp", userAuth, verifyotp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isauthenticated  ); 
authRouter.post("/send-reset-otp", sendresetotp);
authRouter.post("/reset-password",  resetpassword);
export default authRouter;