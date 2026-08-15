import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';
import userRoutes from './routes/userRoutes';
import addressRoutes from './routes/addressRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import foodRoutes from './routes/foodRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';

const app: Application = express();

// Security & Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CloudCraves Backend REST API is operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/users/addresses', addressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

export default app;
