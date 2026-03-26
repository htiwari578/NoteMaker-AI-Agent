import express from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { validateData } from "../middleware/validate.middleware.js";
import { registerUserSchema } from "../validations/auth.validations.js";

const router = express.Router();

router.route("/register").post(validateData(registerUserSchema), registerUser);
export default router;