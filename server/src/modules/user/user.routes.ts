import { Router } from 'express';
import { authenticate, adminOnly } from '../../middleware/auth.middleware.js';
import {
  addEmployee,
  editEmployee,
  getEmployee,
  listEmployees,
  removeEmployee,
} from './user.controller.js';

const router = Router();

// All employee management routes require authentication and admin access.
router.use(authenticate, adminOnly);

router.get('/', listEmployees);
router.post('/', addEmployee);
router.get('/:id', getEmployee);
router.patch('/:id', editEmployee);
router.delete('/:id', removeEmployee);

export default router;