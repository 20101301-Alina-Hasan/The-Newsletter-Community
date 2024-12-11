import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getUpvotes, getUserUpvotes, addUpvote, deleteUpvote } from '../controllers/upvote';

const router = express.Router();

// Get Upvotes
router.get('/:news_id', getUpvotes);

// Get User Upvotes
router.get('/:news_id/:user_id', verifyToken, getUserUpvotes);

// Add Upvote
router.post('/:news_id/:user_id', verifyToken, addUpvote);

// Delete Upvote
router.delete('/:news_id/:user_id', verifyToken, deleteUpvote);

export default router;