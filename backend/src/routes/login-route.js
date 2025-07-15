import { Router } from "express";
import { userLogin } from "../controllers/loginController.js";
const router = Router();

router.post('/login', userLogin);

export default router;