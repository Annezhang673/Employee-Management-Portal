import express, { Router } from "express";
import {
  generateAndSendToken,
  validateToken,
} from "../controllers/registration-controller.js";

const router = Router();

// HR generates token and sends email
router.post("/generate", generateAndSendToken);
router.get("/validate/:token", validateToken);
router.get("/status", validateToken);

export default router;
