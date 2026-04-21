import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: 'Da definire',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
