import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getNews, createNews, updateNews, deleteNews } from '../controllers/news';

const router = express.Router();

// Get News
router.get('/', getNews);

// Create News
router.post('/', verifyToken, createNews);

// Update News
router.put('/:news_id', verifyToken, updateNews);

// Delete News
router.delete('/:news_id', verifyToken, deleteNews);

export default router;
