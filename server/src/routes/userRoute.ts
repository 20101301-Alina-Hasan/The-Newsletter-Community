import express from 'express';
import { getUser, signup, login } from '../controllers/userController';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.get('/me', authenticateUser, getUser);
router.post('/signup', signup);
router.post('/login', login);

export default router;
