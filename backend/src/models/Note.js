import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
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
      default: 'Generale',
      trim: true
    },
    content: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
