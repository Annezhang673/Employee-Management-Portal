import express, { Router } from "express";
import {
  generateAndSendToken,
  validateToken,
  viewTokenStatus,
  checkToken
} from "../controllers/registration-controller.js";

const router = Router();

// HR generates token and sends email
router.post("/generate", generateAndSendToken);
router.post("/validate/:token", validateToken);
router.get("/status", viewTokenStatus);
router.get("/check/:token", checkToken);

export default router;
