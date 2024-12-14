import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { getUserUpvotes, addUpvote, removeUpvote } from '../controllers/upvote';

const router = express.Router();

// router.get('/:news_id', getUpvotes);
router.get('/:news_id/user', authenticateUser, getUserUpvotes);
router.post('/:news_id', authenticateUser, addUpvote);
router.delete('/:news_id', authenticateUser, removeUpvote);

export default router;