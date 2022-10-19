import {Router} from "express";
import userController from "../controllers/userController.js";
import calendarController from "../controllers/calendarController.js";

const router = Router ();

router.get ('/', userController.isLoggedIn, calendarController.getCalendarPage);
router.get ('/login', userController.isLoggedOut, userController.getLoginPage);
router.post ('/login', userController.postLogin);
router.get ('/calendar', userController.isLoggedIn, calendarController.getCalendarPage);

export default router;