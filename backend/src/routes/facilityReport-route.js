import express from 'express';
import {
  createFacilityReport,
  getMyReports,
  addCommentToReport,
  getCommentsForReport,
  updateFacilityReportStatus,
  getReportsByHouse
} from '../controllers/facilityReportController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import requireHR from '../middlewares/requireHR.js';

const router = express.Router();

router.post('/createReport', verifyToken, createFacilityReport); // works
router.get('/getReport', verifyToken, getMyReports); // works
router.post('/:reportId/addComments', verifyToken, addCommentToReport);  // works
router.get('/:reportId/getComments', verifyToken, getCommentsForReport); //works
router.get('/house/:houseId', verifyToken, getReportsByHouse); //works

router.patch('/:reportId/status', verifyToken, requireHR, updateFacilityReportStatus); //works

export default router;
