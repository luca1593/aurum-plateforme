import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import candidatesRouter from "./candidates";
import pipelineRouter from "./pipeline";
import matchingRouter from "./matching";
import adminRouter from "./admin";
import clientRouter from "./client";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/contact", contactRouter);
router.use("/candidates", candidatesRouter);
router.use("/pipeline", pipelineRouter);
router.use("/matching", matchingRouter);
router.use("/admin", adminRouter);
router.use("/client", clientRouter);

export default router;
