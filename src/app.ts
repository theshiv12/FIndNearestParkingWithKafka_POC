require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';

import { AppDataSource } from './utils/data-source';
import AppError from './utils/appError';
import carParkRouter from './routes/carpark.routes';
import { loadCarParkData } from './scripts/carpark_availabilty';
import { startKafkaConsumer } from './subscribers/consumer';
// import { updateCarParkAvailability } from './cron';

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully !");

    const app = express();

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '10kb' }));

    // 2. Logger
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );

    // ROUTES
    app.use('/carparks', carParkRouter);

    // HEALTH CHECKER
    app.get('/api/healthChecker', async (_, res: Response) => {
      // const message = await redisClient.get('try');

      res.status(200).json({
        status: 'success',
        message: 'Welcome to Node.js, we are happy to see you',
      });
    });

    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );
    await loadCarParkData()
    // await updateCarParkAvailability()
    await startKafkaConsumer()
    const port = config.get<number>('port');
    app.listen(port);
    console.log(`Server started with pid: ${process.pid} on port: ${port}`);
  })
  .catch((error) => console.log("Connection Failed::", error));
