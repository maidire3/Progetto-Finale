import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    color: {
      type: String,
      default: 'sage',
      trim: true
    },
    scheduleEnabled: {
      type: Boolean,
      default: false
    },
    scheduleDays: {
      type: [String],
      default: []
    },
    startTime: {
      type: String,
      default: '09:00',
      trim: true
    },
    endTime: {
      type: String,
      default: '11:00',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
