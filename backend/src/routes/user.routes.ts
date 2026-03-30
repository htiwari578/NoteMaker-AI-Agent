import express from "express";
import { registerUser, userLogin, userLogout } from "../controllers/user.controllers.js";
import { validateData } from "../middleware/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "../validations/auth.validations.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(validateData(registerUserSchema), registerUser);
router.route("/login").post(validateData(loginUserSchema), userLogin);
router.route("/logout").get(verifyJwt, userLogout);
export default router;