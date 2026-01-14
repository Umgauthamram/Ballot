import express from 'express';
import { getAllUsers, createPoll, togglePollStatus, getDepartments } from '../controllers/adminController.js';
import { generateUsers } from '../controllers/userGenController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-users', protect, admin, generateUsers);

router.get('/users', protect, admin, getAllUsers);
router.get('/departments', protect, admin, getDepartments);

router.post('/poll', protect, admin, createPoll);

router.patch('/poll-status', protect, admin, togglePollStatus);

export default router;