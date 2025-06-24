import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dev, port } from './utils/helpers';
import authRoutes from './routes/auth.routes';
import classRoutes from './routes/class.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';
import { connectDB } from './config/database';
import { AppError } from './utils/error';

// Load environment variables
dotenv.config();


// Connect to MongoDB
connectDB();

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res
    .status(OK)
    .json({ message: 'Welcome!' });
});

// Error handling middleware
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(dev && { stack: err.stack })
    });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    status: 'error', 
    message: 'Something went wrong!',
    ...(dev && { error: err.message, stack: err.stack })
  });
});

app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
