import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);app.use('/api/users', userRoutes);

// Health check API
app.get('/', (_req, res) => {
  res.json({
    message: 'Employee Management System API is running!',
  });
});

export default app;