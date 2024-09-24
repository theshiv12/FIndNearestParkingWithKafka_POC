import axios from 'axios';
import { AppDataSource } from '../src/utils/data-source';
import { CarPark } from '../src/entities/carparking.entity';

export const updateCarParkAvailability = async () => {
  try {
    const response = await axios.get('https://api.data.gov.sg/v1/transport/carpark-availability');
    const carParks = response.data.items[0].carpark_data; // Adjust based on the actual structure of API data

    const repository = AppDataSource.getRepository(CarPark);

    for (const carParkData of carParks) {
      const existingCarPark = await repository.findOne({ where: { carParkNo: carParkData.carpark_number } });
        
      if (existingCarPark) {
        existingCarPark.availableLots = carParkData.carpark_info[0].lots_available;
        await repository.save(existingCarPark);
      } 
    }

    console.log('Car park availability updated successfully.');
  } catch (error) {
    console.error('Error updating car park availability:', error);
  }
};
