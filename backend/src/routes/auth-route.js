import { Router } from "express";
import { registerUser } from "../controllers/authController.js";
import { userLogin } from "../controllers/loginController.js";
const router = Router();

router.post('/register', registerUser);
router.post("/login", userLogin);

export default router;