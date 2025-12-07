import express from 'express';
import { castVote, getPolls } from '../controllers/voteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPolls);
router.post('/', protect, castVote);

export default router;