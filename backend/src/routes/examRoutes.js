import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createExam,
  deleteExam,
  getExams,
  updateExam
} from '../controllers/examController.js';

const router = express.Router();

router.use(protect);

router.get('/', getExams);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;
