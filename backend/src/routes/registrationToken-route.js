import express, { Router } from "express";
import { generateAndSendToken, getToken } from "../controllers/registration-controller.js";

const router = Router();

// HR generates token and sends email
router.post("/generate", generateAndSendToken);

router.get("/validate/:token", getToken);

export default router;
