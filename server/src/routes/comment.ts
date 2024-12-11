import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getComments, addComment, updateComment, deleteComment } from '../controllers/comment';

const router = express.Router();

// Get Comments
router.get('/:news_id', getComments);

// Add Comment
router.post('/:news_id', verifyToken, addComment);

// Update Comment
router.put('/:comment_id', verifyToken, updateComment);

// Delete Comment
router.delete('/:comment_id', verifyToken, deleteComment);

export default router;
