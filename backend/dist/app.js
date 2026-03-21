import express from 'express';
export const app = express();
const PORT = process.env.PORT || 4000;
//test route
app.get("/health-check", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy and running"
    });
});
