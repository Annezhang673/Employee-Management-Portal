import { Router } from "express";
import { getUserById, getUserProfile, updateUserProfile } from "../controllers/user-controller.js";

const router = Router();

// Get api/users/me
router.get("/me", getUserProfile);

// Put api/users/me
router.put("/me", updateUserProfile);

// Get api/users/:userId
router.get("/:userId", getUserById);

export default router;