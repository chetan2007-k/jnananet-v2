import { Router } from "express";
import authRoutes from "./authRoutes";
import profileRoutes from "./profileRoutes";
import scholarshipRoutes from "./scholarshipRoutes";
import eligibilityRoutes from "./eligibilityRoutes";
import assistantRoutes from "./assistantRoutes";
import documentRoutes from "./documentRoutes";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.get("/health", (req, res) => {
  return sendSuccess(res, {
    status: "HEALTHY",
    version: "v2.0.0",
    service: "JnanaNet V2 Core API",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/scholarships", scholarshipRoutes);
router.use("/eligibility", eligibilityRoutes);
router.use("/assistant", assistantRoutes);
router.use("/documents", documentRoutes);

export default router;
