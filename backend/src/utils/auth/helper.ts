import { Response } from "express"

export const setAuthCookies =(
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}