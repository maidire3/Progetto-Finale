import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import validateEnv from './config/env.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    validateEnv();
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
}

await startServer();
