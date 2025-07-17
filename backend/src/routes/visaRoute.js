import express from 'express';
import {
   getInProgress,
   getAllVisaStatus,
   approveVisaDoc,
   rejectVisaDoc,
   sendVisaReminder,
} from "../controllers/hrVisaController.js";

const router = express.Router();

// list users still in progress
router.get("/in-progress", getInProgress);

// list all visa status
router.get("/all", getAllVisaStatus);

// approve visa document
router.put("/:userId/docs/:docType/approve", approveVisaDoc);

// reject visa document
router.put("/:userId/docs/:docType/reject", rejectVisaDoc);

// send visa reminder
router.post("/reminder", sendVisaReminder);

export default router;