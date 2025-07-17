import express from 'express';
import { verifyToken } from "../middlewares/authMiddleware.js";
import requireHR from "../middlewares/requireHR.js";
import {
  getAvailableHouses,
  getMyHousing,
  createHouse,
  deleteHouse,
  assignUserToHouse,
  unassignUserFromHouse,
  randomlyAssignUserToHouse
} from '../controllers/housing-controller.js';

const router = express.Router();

// Employee Routes
router.get('/available', verifyToken, getAvailableHouses); //working
router.get('/user', verifyToken, getMyHousing); //working

// HR Routes
router.post('/createHouse', verifyToken, requireHR, createHouse); //working
router.delete('/:id', verifyToken, requireHR, deleteHouse); //works
router.post('/:houseId/assign/:userId', verifyToken, requireHR, assignUserToHouse); //works
router.post('/:houseId/unassign/:userId', verifyToken, requireHR, unassignUserFromHouse); //works


router.post('/initialAssignment', verifyToken, randomlyAssignUserToHouse) //works

export default router;
