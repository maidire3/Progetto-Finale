import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*'
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend Study Tracker attivo.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
