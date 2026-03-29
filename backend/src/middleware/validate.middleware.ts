import { Request, Response } from 'express';
import {z } from 'zod';

export function validateData(schema: z.ZodObject<any,any>) {
    return(req: Request, res: Response, next: Function) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if(error instanceof z.ZodError) {
                const errorMessages = error.issues.map((issue: any)=>({
                    message: `${issue.message}`,
                }));
                res.status(400).json({ errors: "Invalid data provided", details: errorMessages });
            }else{
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
}
