import { Router } from "express";
import { registerUser } from "../controllers/authController.js";
const router = Router();

router.post('/register', registerUser);

export default router;