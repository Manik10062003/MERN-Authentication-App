import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/usercontroller.js'; // ✅ Ensure this import exists
const userRouter = express.Router();
userRouter.get('/data', userAuth, getUserData); // ✅ Ensure this route exists
export default userRouter;
