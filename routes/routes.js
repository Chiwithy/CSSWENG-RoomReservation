import {Router} from "router";
import userController from "../controllers/userController.js";

const router = Router ();

router.post ('/login', userController.postLogin);

export default router;