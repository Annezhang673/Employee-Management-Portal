import { Router } from "express";
import {
  getUserById,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user-controller.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Get api/users/me
router.get("/me", verifyToken, getUserProfile);

// Put api/users/me
router.put("/me", verifyToken, updateUserProfile);

// Get api/users/:userId
router.get("/:userId", verifyToken, getUserById);

export default router;
