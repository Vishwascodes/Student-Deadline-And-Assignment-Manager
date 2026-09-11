const Assignment = require('../models/Assignment');
const Subject = require('../models/Subject');
const { validationResult } = require('express-validator');

// @desc    Get all assignments for logged-in user (supports search, filter, sort)
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res, next) => {
  try {
    const { search, subject, priority, status, sortBy } = req.query;

    const query = { user: req.user.id };

    if (subject) query.subject = subject;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    if (search) {
      // Search by title directly, and by subject name via a lookup
      const matchingSubjects = await Subject.find({
        user: req.user.id,
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $in: matchingSubjects.map((s) => s._id) } },
      ];
    }

    let sort = { createdAt: -1 }; // Newest first (default)
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    else if (sortBy === 'dueDate') sort = { dueDate: 1 };
    else if (sortBy === 'priority') sort = { priority: 1 }; // High < Low alphabetically is wrong, handled below

    let assignments = await Assignment.find(query).populate('subject', 'name color').sort(sort);

    // Custom priority sort order: High > Medium > Low
    if (sortBy === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 };
      assignments = assignments.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id }).populate(
      'subject',
      'name color'
    );
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private
const createAssignment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }

    const { title, subject, description, dueDate, priority, status } = req.body;

    const subjectDoc = await Subject.findOne({ _id: subject, user: req.user.id });
    if (!subjectDoc) {
      return res.status(400).json({ success: false, message: 'Selected subject does not exist' });
    }

    const assignment = await Assignment.create({
      user: req.user.id,
      subject,
      title,
      description,
      dueDate,
      priority,
      status,
      completedAt: status === 'Completed' ? new Date() : null,
    });

    const populated = await assignment.populate('subject', 'name color');

    res.status(201).json({ success: true, message: 'Assignment created successfully', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private
const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const { title, subject, description, dueDate, priority, status } = req.body;

    if (subject) {
      const subjectDoc = await Subject.findOne({ _id: subject, user: req.user.id });
      if (!subjectDoc) {
        return res.status(400).json({ success: false, message: 'Selected subject does not exist' });
      }
      assignment.subject = subject;
    }

    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate !== undefined) assignment.dueDate = dueDate;
    if (priority !== undefined) assignment.priority = priority;

    if (status !== undefined) {
      assignment.status = status;
      if (status === 'Completed' && !assignment.completedAt) {
        assignment.completedAt = new Date();
      } else if (status !== 'Completed') {
        assignment.completedAt = null;
      }
    }

    const updated = await assignment.save();
    const populated = await updated.populate('subject', 'name color');

    res.status(200).json({ success: true, message: 'Assignment updated successfully', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark assignment as completed
// @route   PUT /api/assignments/:id/complete
// @access  Private
const markCompleted = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    assignment.status = 'Completed';
    assignment.completedAt = new Date();
    const updated = await assignment.save();
    const populated = await updated.populate('subject', 'name color');

    res.status(200).json({ success: true, message: 'Assignment marked as completed', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, user: req.user.id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    await assignment.deleteOne();
    res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/assignments/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    const endOfTomorrow = new Date(endOfToday);
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

    const [total, completed, pending, inProgress, overdue, dueToday, dueTomorrow] = await Promise.all([
      Assignment.countDocuments({ user: userId }),
      Assignment.countDocuments({ user: userId, status: 'Completed' }),
      Assignment.countDocuments({ user: userId, status: 'Pending' }),
      Assignment.countDocuments({ user: userId, status: 'In Progress' }),
      Assignment.countDocuments({
        user: userId,
        status: { $ne: 'Completed' },
        dueDate: { $lt: startOfToday },
      }),
      Assignment.countDocuments({
        user: userId,
        status: { $ne: 'Completed' },
        dueDate: { $gte: startOfToday, $lt: endOfToday },
      }),
      Assignment.countDocuments({
        user: userId,
        status: { $ne: 'Completed' },
        dueDate: { $gte: endOfToday, $lt: endOfTomorrow },
      }),
    ]);

    const upcomingDeadlines = await Assignment.find({
      user: userId,
      status: { $ne: 'Completed' },
      dueDate: { $gte: startOfToday },
    })
      .populate('subject', 'name color')
      .sort({ dueDate: 1 })
      .limit(5);

    const recentAssignments = await Assignment.find({ user: userId })
      .populate('subject', 'name color')
      .sort({ createdAt: -1 })
      .limit(5);

    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority breakdown for charts
    const priorityBreakdown = await Assignment.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        dueToday,
        dueTomorrow,
        completionPercentage,
        upcomingDeadlines,
        recentAssignments,
        priorityBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  markCompleted,
  deleteAssignment,
  getStats,
};
