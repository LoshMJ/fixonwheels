import { Router } from 'express';
import {
  createRepair,
  acceptRepair,
  updateRepairStep,
  confirmHandoverCustomer,
  confirmHandoverTechnician,
} from '../controllers/repair.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, requireRole('customer'), createRepair);
router.post('/:id/accept', requireAuth, requireRole('technician'), acceptRepair);
router.patch('/:id/step/:stepId', requireAuth, requireRole('technician'), updateRepairStep);
router.post('/:id/handover/customer', requireAuth, requireRole('customer'), confirmHandoverCustomer);
router.post('/:id/handover/technician', requireAuth, requireRole('technician'), confirmHandoverTechnician);

export default router;