import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getTags, addTag, deleteTag } from '../controllers/tag';

const router = express.Router();

// Get Tags
router.get('/:news_id', getTags);

// Add Tag
router.post('/:news_id', verifyToken, addTag);

// Delete Tag
router.delete('/:news_id/:tag_id', verifyToken, deleteTag);

export default router;