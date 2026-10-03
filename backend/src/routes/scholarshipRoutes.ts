import { Router } from "express";
import { ScholarshipController } from "../controllers/scholarshipController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", ScholarshipController.list);
router.get("/:id", ScholarshipController.getById);
router.post("/compare", authenticateToken as any, ScholarshipController.compare as any);

export default router;
