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
    },
    weekStart: {
      type: String,
      default: 'monday',
      trim: true
    },
    plannerStartHour: {
      type: String,
      default: '06:00',
      trim: true
    },
    plannerEndHour: {
      type: String,
      default: '22:00',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
