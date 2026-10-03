import { Router } from "express";
import { EligibilityController } from "../controllers/eligibilityController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken as any);

router.post("/evaluate", EligibilityController.evaluate as any);
router.post("/simulate", EligibilityController.simulate as any);

export default router;
