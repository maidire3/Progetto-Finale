import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: 'Da fare',
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    dueDate: {
      type: String,
      default: '',
      trim: true
    },
    startHour: {
      type: Number,
      default: null
    },
    endHour: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
