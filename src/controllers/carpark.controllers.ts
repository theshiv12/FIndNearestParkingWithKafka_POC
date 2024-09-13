import {  NextFunction, Request, Response } from 'express';
import { _findNearest } from '../services/carpark.service';



export const resendVerifyLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nearestParkingLot = await _findNearest();
    return res.status(201).json({
      status: 'success',
      nearestParkingLot
    });
    
  } catch (err: any) {
    next(err);
  }
};
