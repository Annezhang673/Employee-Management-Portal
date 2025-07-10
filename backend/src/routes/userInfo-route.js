import { Router } from "express";
import { getUserInfo, getUserInfoById, updateUserInfo } from '../controllers/userInfo-controller.js'


const router = Router();

router.get("/me", getUserInfo); // get logged in user info
router.get('/:userId', getUserInfoById); // get user info by id, so HR can see user info

router.put("/me", updateUserInfo); // update user info


export default router;