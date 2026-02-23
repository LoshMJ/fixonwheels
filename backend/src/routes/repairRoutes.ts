import { Router } from 'express';
import {
  createRepair,
  getRepair,
  updateRepair,
  addNote,
  getAssignedRepairs
} from '../controllers/repairController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, roleMiddleware('customer'), createRepair);
router.get('/:id', authMiddleware, getRepair);
router.put('/:id', authMiddleware, roleMiddleware('technician'), updateRepair);
router.post('/:id/notes', authMiddleware, roleMiddleware('technician'), addNote);
router.get('/', authMiddleware, roleMiddleware('technician'), getAssignedRepairs);

export default router;