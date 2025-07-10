import { Router } from "express";
import multer from "multer";
import { uploadDocuments } from "../controllers/uploadDocument-controller.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadDocuments);

export default router;
