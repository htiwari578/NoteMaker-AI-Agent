import express, { Request, Response } from 'express';
import { success } from 'zod';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { prisma } from './lib/prisma.js';
import userRouter from './routes/user.routes.js';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))



//test route

app.get("/health-check", (req, res) => {
    res.status(200).json({
    success: true,
    message: "Server is healthy and running"});
});

app.get("/test", async(req: Request, res: Response) => {
    try {
        const notes = await prisma.note.findMany();
        res.status(200).json({
            success: true,
            data: notes
        });
    } catch (error) {
        console.log(error);
    }
})

app.use("/api/v1/users",userRouter)