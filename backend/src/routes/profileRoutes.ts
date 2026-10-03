import { Router } from "express";
import { ProfileController } from "../controllers/profileController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken as any);

router.get("/", ProfileController.getProfile as any);
router.put("/personal", ProfileController.updatePersonal as any);
router.put("/academic", ProfileController.updateAcademic as any);
router.put("/financial", ProfileController.updateFinancial as any);
router.get("/strength", ProfileController.getStrength as any);

export default router;
