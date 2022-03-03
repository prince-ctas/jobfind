import express from "express";
import { login, register, updateuser } from "../controller/authController.js";
import Authentication from "../middleware/auth.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateuser").patch(Authentication, updateuser);

export default router;
