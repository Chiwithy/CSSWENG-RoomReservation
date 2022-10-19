import { Router } from "express";
import controller from '../controllers/userController.js'

const router = Router();

router.get(`/`, controller.getRegister); 
// router.post(`/register`, controller.postRegister); 

export default router;
