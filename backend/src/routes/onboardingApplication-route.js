import { Router } from "express";
import {
  submitOnboardingApplication,
  viewOnboardingApplication,
  updateOnboardingApplication,
} from "../controllers/onboardingApplication-controller.js";

import multer from "multer";
import { verifyToken } from "../middlewares/authMiddleware.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", upload.any(), verifyToken, submitOnboardingApplication);

router.get("/", verifyToken, viewOnboardingApplication);

export default router;
