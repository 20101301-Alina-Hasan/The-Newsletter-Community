import express from 'express';
import { getTags } from '../controllers/tagController';

const router = express.Router();

router.get('/', getTags);

export default router;