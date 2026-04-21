import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    school: {
      type: String,
      default: '',
      trim: true
    },
    courseOfStudy: {
      type: String,
      default: '',
      trim: true
    },
    language: {
      type: String,
      default: 'it',
      trim: true
    },
    theme: {
      type: String,
      default: 'dark',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
