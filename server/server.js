import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import connectdb from './config/mongodb.js';
import authRouter from './routes/authroutes.js'; 
import userRouter from './routes/userRoutes.js';
const app = express();
const port = process.env.PORT || 8000;
connectdb();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get('/' , (req,res) => res.send('its working'));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(port , () => 
    console.log(`Server is running on port ${port}`)
)
