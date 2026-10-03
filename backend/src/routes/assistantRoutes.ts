import { Router } from "express";
import { AssistantController } from "../controllers/assistantController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken as any);

router.post("/chat", AssistantController.chat as any);

export default router;
