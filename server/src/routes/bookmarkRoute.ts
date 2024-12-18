import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { addBookmark, removeBookmark } from '../controllers/bookmarkController';

const router = express.Router();

// router.get('/:news_id', authenticateUser, getBookmark);
// router.get('/', authenticateUser, getUserBookmarks);
router.post('/:news_id', authenticateUser, addBookmark);
router.delete('/:news_id', authenticateUser, removeBookmark);

export default router;