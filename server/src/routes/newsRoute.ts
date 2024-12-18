import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import {
    getNewsById,
    getAllNews,
    getUserNews,
    createNews,
    updateNews,
    deleteNews,
    searchNews
} from '../controllers/newsController';

const router = express.Router();

// Public Routes
router.get('/', getAllNews);
router.get('/search', searchNews);

// User-specific Routes
router.get('/user', authenticateUser, getUserNews);
router.get('/search/user', authenticateUser, searchNews);

// News by ID Routes
router.get('/:news_id', getNewsById);

// Protected Routes (Require authentication)
router.post('/', authenticateUser, createNews);
router.put('/:news_id', authenticateUser, updateNews);
router.delete('/:news_id', authenticateUser, deleteNews);

export default router;

