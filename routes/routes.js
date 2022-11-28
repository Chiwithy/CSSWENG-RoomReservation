import { Router } from "express";
import userController from "../controllers/userController.js";
import calendarController from "../controllers/calendarController.js";
import bookviewController from "../controllers/bookviewController.js";

const router = Router();

//gets calender if logged in, otherwise goes to /login
router.get ('/', userController.isLoggedIn, calendarController.getCalendarPage); 

router.get ('/checkUsername', userController.checkUsername);
router.get ('/calendar', userController.isLoggedIn, calendarController.getCalendarPage);

router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister); 

router.get ('/login', userController.isLoggedOut, userController.getLogin);
router.post ('/login', userController.postLogin);
router.post ('/logout', userController.postLogout);

router.get ('/getAccountType', userController.getAccountType);

router.get ('/bookandview', userController.isLoggedIn, calendarController.isValidCalendarDate, bookviewController.getBookview);
router.get ('/getMeetings', userController.isLoggedIn, bookviewController.getMeetings);
router.get ('/renderMeetingRows', userController.isLoggedIn, bookviewController.renderMeetingRows);

router.post('/addBookedMeeting', userController.isLoggedIn, bookviewController.postMeeting); 
router.get('/getMeetingByID', userController.isLoggedIn, bookviewController.getMeetingById)
router.get('/editMeetingReg', userController.isLoggedIn, bookviewController.getEditMeetingReg); 
export default router;