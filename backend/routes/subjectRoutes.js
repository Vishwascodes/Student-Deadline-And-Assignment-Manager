const express = require('express');
const { body } = require('express-validator');
const { getSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

const subjectValidation = [body('name').trim().notEmpty().withMessage('Subject name is required')];

router.route('/').get(getSubjects).post(subjectValidation, createSubject);
router.route('/:id').put(updateSubject).delete(deleteSubject);

module.exports = router;
