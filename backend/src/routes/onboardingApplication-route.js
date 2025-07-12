import { Router } from "express";
import { submitOnboardingApplication } from "../controllers/onboardingApplication-controller.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", upload.any(), submitOnboardingApplication);

export default router;
