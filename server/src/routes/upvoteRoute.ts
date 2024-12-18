import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { getUpvotes, addUpvote, removeUpvote } from '../controllers/upvoteController';

const router = express.Router();

router.get('/:news_id', getUpvotes);
// router.get('/:news_id/user', authenticateUser, getUserUpvotes);
router.post('/:news_id', authenticateUser, addUpvote);
router.delete('/:news_id', authenticateUser, removeUpvote);

export default router;