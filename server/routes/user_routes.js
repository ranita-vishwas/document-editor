import express from 'express';
import { login, signup, logout } from '../controller/user_controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// User Authentication Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;