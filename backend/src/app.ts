import express, { Request, Response } from 'express';
import { success } from 'zod';
import { prisma } from './lib/prisma.js';

export const app = express();
const PORT = process.env.PORT || 4000;



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