import { Router } from "express";
import userController from "../controllers/userController.js";
import calendarController from "../controllers/calendarController.js";

const router = Router();

//gets calender if logged in, otherwise goes to /login
router.get ('/', userController.isLoggedIn, calendarController.getCalendarPage); 

router.get ('/checkUsername', userController.checkUsername);

router.get ('/calendar', userController.isLoggedIn, calendarController.getCalendarPage);

router.get ('/login', userController.isLoggedOut, userController.getLogin);
router.post ('/login', userController.postLogin);

router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister); 

export default router;
