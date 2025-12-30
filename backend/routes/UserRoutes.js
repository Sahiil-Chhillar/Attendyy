import { Router } from "express";
import UserController from "../controllers/UserController.js";
import JWT from "../middleware/JWT.js";

const router = Router();
router.post("/signin", UserController.Login);
router.post("/signup", UserController.Signup);
router.post("/forgotpassword", UserController.ForgotPassword);
router.post("/edituserdetails", JWT.verifyToken, UserController.EditUserDetails);
router.post("/sendmail", UserController.SendMail);

export default router;