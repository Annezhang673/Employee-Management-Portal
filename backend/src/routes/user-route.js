import { Router } from "express";
import { getUserById, getUserProfile, updateUserProfile } from "../controllers/user-controller.js";
import multer from "multer";
import { verifyToken } from "../middlewares/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });


const router = Router();

router.get('/', listEmployees);

// Get api/users/me
router.get("/me", verifyToken, getUserProfile);

// Put api/users/me
router.put("/me", verifyToken, upload.single("profilePic"), updateUserProfile);

// Get api/users/:userId
router.get("/:userId", verifyToken, getUserById);

export default router;
