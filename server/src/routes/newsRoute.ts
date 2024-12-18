import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import {
    getNewsByBookmark,
    getNewsById,
    getUserNewsById,
    getUserAllNews,
    getAllNews,
    getUserNews,
    createNews,
    updateNews,
    deleteNews,
    searchNews
} from '../controllers/newsController';

const router = express.Router();

// Public Routes
router.get('/all', getAllNews);
router.get('/user/all', authenticateUser, getUserAllNews);
router.get('/search', searchNews);

// User-specific Routes
router.get('/user', authenticateUser, getUserNews);
router.get('/user/search', authenticateUser, searchNews);
router.get('/user/bookmark', authenticateUser, getNewsByBookmark)

// News by ID Routes
router.get('/:news_id', getNewsById);
router.get('/user/:news_id', authenticateUser, getUserNewsById);

// Protected Routes (Require authentication)
router.post('/', authenticateUser, createNews);
router.put('/:news_id', authenticateUser, updateNews);
router.delete('/:news_id', authenticateUser, deleteNews);

export default router;

