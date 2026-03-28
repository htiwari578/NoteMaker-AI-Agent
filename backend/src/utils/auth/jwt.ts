import { IUser } from "../../types/index.js";
import jwt,{Secret , SignOptions}  from "jsonwebtoken";


export const generateAccessToken= (user: IUser)=>{
    const accessToken = process.env.JWT_ACCESS_SECRET_KEY as Secret;
    const options : SignOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
    };
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
    },
    accessToken,
    options
);
}

export const generateRefreshToken = (user: IUser)=>{
    const refreshToken = process.env.JWT_REFRESH_SECRET_KEY as Secret;
    const options : SignOptions = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
    };
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        refreshToken,
        options
    );
}