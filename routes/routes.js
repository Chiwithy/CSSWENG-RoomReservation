import { Router } from "express";
import controller from '../controllers/userController.js'

const router = Router();

router.get('/', controller.getLogin);

router.get('/login', controller.getLogin); 
router.get ('/checkUsername', controller.checkUsername);
router.get('/register', controller.getRegister);
router.post('/register', controller.postRegister); 
//router.get ('/successfulReg', controller.getSuccess);

router.get('/logout', controller.isLoggedIn, controller.getLogout); 

export default router;
