import {z} from 'zod';

//register user schema
export const registerUserSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().trim().toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})
.strict();

//login user schema
export const loginUserSchema = z.object({
    email: z.string().min(1, 'Email is required').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
})
.strict();


export type RegisterInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginUserSchema>;