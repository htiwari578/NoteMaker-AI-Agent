import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { IJwtUserPayload } from "../types/index.js";
import { prisma } from "../lib/prisma";


export const verifyJwt = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

        //check if token is present
        if(!token){
            throw new ApiError(401, "Unauthorized");
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET_KEY!
        ) as IJwtUserPayload;

        //find user in DB
        const user = await prisma.user.findUnique({
            where: {
                email: decode.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        if(!user){
            throw new ApiError(401, "Unauthorized");
        }
        req.user = user;
        next();
    } catch (error: unknown) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                errors: error.errors,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}