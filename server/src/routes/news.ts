import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { getNews, getUserNews, createNews, updateNews, deleteNews } from '../controllers/news';

const router = express.Router();

router.get('/', getNews);
router.get('/user', authenticateUser, getUserNews);
router.post('/', authenticateUser, createNews);
router.put('/:news_id', authenticateUser, updateNews);
router.delete('/:news_id', authenticateUser, deleteNews);

export default router;
