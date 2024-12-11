import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getBookmark, getUserBookmarks, addBookmark, removeBookmark } from '../controllers/bookmark';

const router = express.Router();

// Get Bookmark by News
router.get('/:news_id', verifyToken, getBookmark);

// Get User Bookmarks 
router.get('/', verifyToken, getUserBookmarks);

// Add Bookmarks
router.post('/:news_id', verifyToken, addBookmark);

// Delete Bookmarks
router.delete('/:news_id', verifyToken, removeBookmark);

export default router;