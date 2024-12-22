import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import {
    getNewsById,
    getAllNews,
    getBookmarkedNews,
    createNews,
    updateNews,
    deleteNews,
    searchNews
} from '../controllers/newsController';

const router = express.Router();

// Public Routes
router.get('/all', getAllNews);
router.get('/all', authenticateUser, getAllNews);
router.get('/all/search', searchNews);

// User-specific Routes
router.get('/', authenticateUser, getAllNews);
router.get('/search', authenticateUser, searchNews);
router.get('/bookmark', authenticateUser, getBookmarkedNews)

// News by ID Routes
router.get('/public/:news_id', getNewsById);
router.get('/:news_id', authenticateUser, getNewsById);

// Protected Routes (Require authentication)
router.post('/', authenticateUser, createNews);
router.put('/:news_id', authenticateUser, updateNews);
router.delete('/:news_id', authenticateUser, deleteNews);

export default router;

