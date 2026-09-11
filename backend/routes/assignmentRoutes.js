const express = require('express');
const { body } = require('express-validator');
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  markCompleted,
  deleteAssignment,
  getStats,
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

const assignmentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().withMessage('Due date must be a valid date'),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Priority must be High, Medium, or Low'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),
];

router.get('/stats', getStats);
router.route('/').get(getAssignments).post(assignmentValidation, createAssignment);
router.route('/:id').get(getAssignmentById).put(updateAssignment).delete(deleteAssignment);
router.put('/:id/complete', markCompleted);

module.exports = router;
