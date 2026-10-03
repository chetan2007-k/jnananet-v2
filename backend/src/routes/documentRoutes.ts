import { Router } from "express";
import { DocumentController } from "../controllers/documentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken as any);

router.get("/", DocumentController.list as any);
router.post("/presigned-url", DocumentController.getPresignedUploadUrl as any);
router.get("/:id/download", DocumentController.getDownloadUrl as any);
router.post("/:id/analyze", DocumentController.analyze as any);

export default router;
