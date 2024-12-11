import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { createNews, updateNews, deleteNews } from '../controllers/news';

const router = express.Router();

// Create News
router.post('/', verifyToken, createNews);

// Update News
router.put('/:id', verifyToken, updateNews);

// Delete News
router.delete('/:id', verifyToken, deleteNews);

export default router;
