import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getUpvotes, getUserUpvotes, addUpvote, removeUpvote } from '../controllers/upvote';

const router = express.Router();

// Get Upvotes
router.get('/:news_id', getUpvotes);

// Get User Upvotes on a Specific News Article
router.get('/:news_id/user', verifyToken, getUserUpvotes);

// Add Upvote
router.post('/:news_id', verifyToken, addUpvote);

// Delete Upvote
router.delete('/:news_id', verifyToken, removeUpvote);

export default router;