import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject
} from '../controllers/subjectController.js';

const router = express.Router();

router.use(protect);

router.get('/', getSubjects);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
