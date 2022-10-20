import { Router } from "express";
import controller from '../controllers/userController.js'

const router = Router();

router.get(`/`, controller.getRegister);
router.get ('/checkUsername', controller.checkUsername);
router.get('/register', controller.getRegister);
router.post(`/register`, controller.postRegister); 
router.get ('/successfulReg', controller.getSuccess);

export default router;
