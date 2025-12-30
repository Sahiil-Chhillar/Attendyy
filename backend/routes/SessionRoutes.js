import { Router } from "express";
import upload from "../middleware/Multer.js";
import SessionController from "../controllers/SessionController.js";
import JWT from "../middleware/JWT.js";

const router = Router();
router.post("/create", JWT.verifyToken, SessionController.CreateNewSession);
router.post("/getSessions", JWT.verifyToken, SessionController.GetAllTeacherSessions);
router.post("/getQR", JWT.verifyToken, SessionController.GetQR);
router.post("/attend_session", upload.single("image"), JWT.verifyToken, SessionController.AttendSession);
router.post("/getStudentSessions", JWT.verifyToken, SessionController.GetStudentSessions);


export default router;