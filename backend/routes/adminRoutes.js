import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadId, verifyUser, getAllUsers, createPoll, togglePollStatus } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/upload-id', protect, upload.single('idCard'), uploadId);

router.patch('/verify', protect, admin, verifyUser);

router.get('/users', protect, admin, getAllUsers);

router.post('/poll', protect, admin, createPoll);

router.patch('/poll-status', protect, admin, togglePollStatus);

export default router;