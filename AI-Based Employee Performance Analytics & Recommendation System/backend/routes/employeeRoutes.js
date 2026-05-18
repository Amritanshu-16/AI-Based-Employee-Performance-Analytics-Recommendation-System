import express from 'express';
import {
  getEmployees,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getEmployees).post(protect, createEmployee);
router.route('/search').get(protect, searchEmployees);
router.route('/:id').put(protect, updateEmployee).delete(protect, deleteEmployee);

export default router;
