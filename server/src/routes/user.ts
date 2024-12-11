import express from 'express';
import { signup, login } from '../controllers/user';

const router = express.Router();

// User Signup
router.post('/signup', signup);

// User Login
router.post('/login', login);

export default router;
