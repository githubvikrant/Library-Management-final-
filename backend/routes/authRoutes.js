import express from 'express';
import { Register,verifyOTP,login,logout, forgotPassword ,resetPassword,updatepassword} from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', Register);
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);
router.get('/logout',isAuthenticated,logout);
router.get('/me',isAuthenticated,getUser);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);
router.put("/password/update",isAuthenticated,updatepassword);

export default router;
