import { Request, Response } from "express";
import { noteService } from "../services/note.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";



export const getAllNotes = async (req:Request, res:Response) => {
    try {
        const userId = req.user?.id as string;
        const notes = await noteService.getAll(userId);

        return res.status(200).json(new ApiResponse(200, notes, "notes fetched successfully"));
    } catch (error: unknown) {
        console.error("Login user error",error);

        if(error instanceof ApiError){
            return res.status(error.statusCode).json({
            
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
    return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    });
    }
}