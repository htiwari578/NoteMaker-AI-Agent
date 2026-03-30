import express from "express";
import { registerUser, userLogin } from "../controllers/user.controllers.js";
import { validateData } from "../middleware/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "../validations/auth.validations.js";

const router = express.Router();

router.route("/register").post(validateData(registerUserSchema), registerUser);
router.route("/login").post(validateData(loginUserSchema), userLogin);
export default router;