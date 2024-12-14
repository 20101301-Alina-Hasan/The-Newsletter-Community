import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { getComments, addComment, updateComment, deleteComment } from '../controllers/comment';

const router = express.Router();

router.get('/:news_id', getComments);
router.post('/:news_id', authenticateUser, addComment);
router.put('/:comment_id', authenticateUser, updateComment);
router.delete('/:comment_id', authenticateUser, deleteComment);

export default router;
