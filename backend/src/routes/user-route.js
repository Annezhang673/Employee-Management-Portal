import { Router } from "express";
import multer from "multer";
import {
  getUserById,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user-controller.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Get api/users/me
router.get("/me", verifyToken, getUserProfile);

// Put api/users/me
router.put("/me", verifyToken, upload.single("profilePic"), updateUserProfile);

// Get api/users/:userId
router.get("/:userId", verifyToken, getUserById);

export default router;
