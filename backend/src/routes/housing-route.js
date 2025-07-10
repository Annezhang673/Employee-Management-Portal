import { Router } from "express";
import {
  viewMyHousing,
  viewAllHousing,
  createNewHousing,
  deleteHousing,
} from "../controllers/housing-controller.js";

const router = Router();

// Get api/housing/my, Employee can view assigned house and roommates
router.get("/my", viewMyHousing);

// Get api/housing, List all houses for HR
router.get("/", viewAllHousing);

//  Post api/housing, HR creates new house
router.post("/", createNewHousing);

//  Delete api/housing/:id, HR deletes house
router.delete("/:houseId", deleteHousing);

export default router;