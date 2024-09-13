import config from 'config';
import crypto from 'crypto';
import { CarPark } from '../entities/carparking.entity';
import { AppDataSource } from '../utils/data-source';


const carparkRepository = AppDataSource.getRepository(CarPark);

export const _findNearest = async () => {
  return "nearest found"
};



