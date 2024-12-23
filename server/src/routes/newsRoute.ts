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


// ----- News by Bookmark -----

router.get('/bookmark', authenticateUser, getBookmarkedNews)

// ----- News by ID Routes -----

router.get('/private/:news_id', authenticateUser, getNewsById);
router.get('/public/:news_id', getNewsById);

// ----- Public Routes -----

router.get('/all/:user_id?', getNewsByESClient)
// router.get('/all', getNewsByESClient)
// router.get('/all', getAllNews);

// router.get('/all/:user_id?', getNewsByESClient) //ALL NEWS BUT WITH USER INTERACTIONS!!
// router.get('/all', authenticateUser, getAllNews);

router.get('/all/search/:user_id?', getNewsByESClient);
// router.get('/all/search', getNewsByESClient);
// router.get('/all/search', searchNews);


// ----- User-specific Routes -----

router.get('/search/:user_id?', authenticateUser, getNewsByESClient);
// router.get('/search', authenticateUser, getNewsByESClient);
// router.get('/search', authenticateUser, searchNews);

router.get('/:user_id?', authenticateUser, getNewsByESClient);
// router.get('/', authenticateUser, getNewsByESClient);
// router.get('/', authenticateUser, getAllNews);

// ----- Protected Routes -----
router.post('/', authenticateUser, createNewsByESClient);
router.put('/:news_id', authenticateUser, updateNewsByESClient);
router.delete('/:news_id', authenticateUser, deleteNewsByESClient);

// ----- Previous Protected Routes -----
// router.post('/', authenticateUser, createNews);
// router.put('/:news_id', authenticateUser, updateNews);
// router.delete('/:news_id', authenticateUser, deleteNews);

export default router;

