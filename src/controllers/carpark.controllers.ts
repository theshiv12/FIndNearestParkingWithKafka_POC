import {  NextFunction, Request, Response } from 'express';
import { _findNearestParkingLot,_getAllCarPark } from '../services/carpark.service';



export const findNearestParkingLot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { latitude, longitude, page = 1, per_page = 10 } = req.query;
    const carParks = await _findNearestParkingLot(Number(latitude), Number(longitude), Number(page), Number(per_page));
    return res.status(201).json({
      status: 'success',
      carParks
    });
    
  } catch (err: any) {
    next(err);
  }
};


export const getAllCarPark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const carParks = await _getAllCarPark();
    return res.status(201).json({
      status: 'success',
      carParks,
      count:carParks.length
    });
    
  } catch (err: any) {
    next(err);
  }
};
