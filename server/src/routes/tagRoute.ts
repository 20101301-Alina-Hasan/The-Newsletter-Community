import express from 'express';
import { getTags, getTagByID } from '../controllers/tagController';

const router = express.Router();

router.get('/', getTags);
// router.get('/:tag_id', getTagByID);

export default router;