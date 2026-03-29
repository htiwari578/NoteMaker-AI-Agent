import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../lib/prisma.js";
import { comparedPassword, encryptPassword } from "../utils/auth/hash.js";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/jwt.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { setAuthCookies } from "../utils/auth/helper.js";


export const registerUser = async(req:Request,res:Response)=>{
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if(existingUser){
            throw new ApiError(400, "Email already in use");
        }

        const hashedPassword = await encryptPassword(password);

        const user = await prisma.user.create({
            data: {
                name: name.toLowerCase().trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
            }
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(201).json(
            new ApiResponse(
                201, 
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,  
                    },
                    accessToken,
                    refreshToken,
                },
                "User registered successfully"
        )
    );
        
    } catch (error: unknown) {
        console.error("Error in registerUser controller:", error);
        if(error instanceof ApiError){
            res.status(error.statusCode).json({
            success:false,
            message: error.message,
            errors: error.message 
        });
        }
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
            errors: [],
        });
    }
};

export const userLogin = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {email},
        });
        if(!user){
            throw new ApiError(400, "Invalid email or password");
        }
        //if password matches
        const isPasswordValid = await comparedPassword(password, user.password);
        if(!isPasswordValid){
            throw new ApiError(400, "Invalid email or password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                    },
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
        
    } catch (error: unknown) {
        console.error("Error in userLogin", error);
        if(error instanceof ApiError){
            return res.status(error.statusCode).json({
            success:false,
            message: error.message,
            errors: error.message 
        });
        }
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
            errors: [],
        });
    }
}