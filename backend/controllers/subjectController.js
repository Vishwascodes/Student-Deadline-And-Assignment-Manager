const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const { validationResult } = require('express-validator');

// @desc    Get all subjects for logged-in user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.user.id }).sort({ name: 1 });

    // Attach assignment count per subject for a richer UI
    const subjectIds = subjects.map((s) => s._id);
    const counts = await Assignment.aggregate([
      { $match: { user: req.user._id, subject: { $in: subjectIds } } },
      { $group: { _id: '$subject', count: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce((acc, c) => {
      acc[c._id.toString()] = c.count;
      return acc;
    }, {});

    const result = subjects.map((s) => ({
      ...s.toObject(),
      assignmentCount: countMap[s._id.toString()] || 0,
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, color } = req.body;

    const exists = await Subject.findOne({ user: req.user.id, name: name.trim() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'You already have a subject with this name' });
    }

    const subject = await Subject.create({ user: req.user.id, name: name.trim(), color });
    res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const { name, color } = req.body;
    if (name) subject.name = name.trim();
    if (color) subject.color = color;

    const updated = await subject.save();
    res.status(200).json({ success: true, message: 'Subject updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subject (and its assignments)
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    await Assignment.deleteMany({ subject: subject._id, user: req.user.id });
    await subject.deleteOne();

    res.status(200).json({ success: true, message: 'Subject and its assignments deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };
