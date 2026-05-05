import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import studentsRouter from "./students";
import lecturersRouter from "./lecturers";
import coursesRouter from "./courses";
import admissionsRouter from "./admissions";
import enrollmentsRouter from "./enrollments";
import dashboardRouter from "./dashboard";
import verificationRouter from "./verification";
import adminRouter from "./admin";
import openaiChatRouter from "./openai-chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(studentsRouter);
router.use(lecturersRouter);
router.use(coursesRouter);
router.use(admissionsRouter);
router.use(enrollmentsRouter);
router.use(dashboardRouter);
router.use(verificationRouter);
router.use(adminRouter);
router.use(openaiChatRouter);

export default router;
