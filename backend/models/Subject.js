const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [60, 'Subject name cannot exceed 60 characters'],
    },
    color: {
      type: String,
      default: '#6366f1', // default indigo accent
    },
  },
  { timestamps: true }
);

subjectSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
