import express from 'express';
import {
   listApplications, 
   getApplication, 
   approveApplication, 
   rejectApplication
} from '../controllers/HrReview-controller.js';
// import requireHR from '../middlewares/requireHR.js';

const router = express.Router();
// router.use(requireHR);

/*
1. GET /api/hiring/review?status=Pending|Rejected|Approved

list minial info of apps in that bucket
*/
router.get('/', listApplications);


// 2. GET  /api/hiring/review/:appId       -> retrive full application
router.get('/:appId', getApplication);

// 3. PUT  /api/hiring/review/:appId/approve    -> mark it as approve
router.put('/:appId/approve', approveApplication);

// 4. PUT  /api/hiring/review/:appId/reject
router.put('/:appId/reject', rejectApplication);

export default router;

