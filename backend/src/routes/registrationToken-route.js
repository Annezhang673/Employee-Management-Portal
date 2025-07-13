import express, { Router } from "express";
import {
  generateAndSendToken,
  validateToken,
  viewTokenStatus
} from "../controllers/registration-controller.js";

const router = Router();

// HR generates token and sends email
router.post("/generate", generateAndSendToken);
router.get("/validate/:token", validateToken);
router.get("/status", viewTokenStatus);

export default router;
