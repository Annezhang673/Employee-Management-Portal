import { Router } from "express";
import multer from "multer";
import {
  uploadDocuments,
  getUserDocuments,
} from "../controllers/uploadDocument-controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), verifyToken, uploadDocuments);

router.get("/user", verifyToken, getUserDocuments);

export default router;
