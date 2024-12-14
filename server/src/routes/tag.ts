import express from 'express';
import { authenticateUser } from '../middlewares/auth';
import { getTags, addTag, deleteTag } from '../controllers/tag';

const router = express.Router();

router.get('/:news_id', getTags);
router.post('/:news_id', authenticateUser, addTag);
router.delete('/:news_id/:tag_id', authenticateUser, deleteTag);

export default router;