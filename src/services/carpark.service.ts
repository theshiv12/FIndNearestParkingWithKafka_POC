import { CarPark } from '../entities/carparking.entity';
import { AppDataSource } from '../utils/data-source';

const carparkRepository = AppDataSource.getRepository(CarPark);

export const _findNearestParkingLot = async (latitude: number, longitude: number, page: number, perPage: number) => {
    const radius = 1000 / 1000; 
    const offset = (page - 1) * perPage;
  
    const carParks = await AppDataSource.getRepository(CarPark)
      .createQueryBuilder("carPark")
      .addSelect(`
        ( 6371 * acos(
          cos( radians(:latitude) ) * cos( radians(carPark.latitude) ) * 
          cos( radians(carPark.longitude) - radians(:longitude) ) + 
          sin( radians(:latitude) ) * sin( radians(carPark.latitude) )
        ) ) AS distance
      `)
      .where(`
        ( 6371 * acos(
          cos( radians(:latitude) ) * cos( radians(carPark.latitude) ) * 
          cos( radians(carPark.longitude) - radians(:longitude) ) + 
          sin( radians(:latitude) ) * sin( radians(carPark.latitude) )
        ) ) <= :radius
      `)
      .orderBy("distance")
      .setParameters({
        latitude,
        longitude,
        radius
      })
      .limit(perPage)
      .offset(offset)
      .getRawMany();
  
    return carParks;
  
};

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

export const _getAllCarPark = async()=>{  
  return await carparkRepository.find()
}