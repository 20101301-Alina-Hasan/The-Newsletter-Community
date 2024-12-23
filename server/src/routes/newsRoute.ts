import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { trackUser } from "../middlewares/trackUser"
import {
    getNewsById,
    getAllNews,
    getBookmarkedNews,
    createNews,
    updateNews,
    deleteNews,
    searchNews,
} from '../controllers/newsController';
import {
    createNewsByESClient,
    updateNewsByESClient,
    deleteNewsByESClient,
    getNewsByESClient
} from '../controllers/esClient/newsController';
const router = express.Router();

// Public Routes
// router.get('/all', getNewsByESClient)
router.get('/all', getNewsByESClient)
// router.get('/all', getAllNews);

// router.get('/all', authenticateUser, getNewsByESClient) //ALL NEWS BUT WITH USER INTERACTIONS!!
// router.get('/all', authenticateUser, getAllNews);

router.get('/all/search', getNewsByESClient);
// router.get('/all/search', searchNews);

// User-specific Routes
router.get('/', authenticateUser, getNewsByESClient);
// router.get('/', authenticateUser, getAllNews);

router.get('/search', authenticateUser, getNewsByESClient);
// router.get('/search', authenticateUser, searchNews);

router.get('/bookmark', authenticateUser, getBookmarkedNews)

// News by ID Routes
router.get('/public/:news_id', getNewsById);
router.get('/:news_id', authenticateUser, getNewsById);

// Protected Routes (Require authentication)

router.post('/', authenticateUser, createNewsByESClient);
// router.post('/', authenticateUser, createNews);

router.put('/:news_id', authenticateUser, updateNewsByESClient);
// router.put('/:news_id', authenticateUser, updateNews);

router.delete('/:news_id', authenticateUser, deleteNewsByESClient);
// router.delete('/:news_id', authenticateUser, deleteNews);

export default router;

