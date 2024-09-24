import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { AppDataSource } from '../utils/data-source';
import { CarPark } from '../entities/carparking.entity';
import proj4 from 'proj4';

const svy21 = '+proj=tmerc +lat_0=1.3666666666666667 +lon_0=103.83333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +datum=WGS84 +units=m +no_defs';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

const convertSvy21ToWgs84 = (x: number, y: number) => {
    const [longitude, latitude] = proj4(svy21, wgs84, [x, y]);
    return { latitude, longitude };
};

export const loadCarParkData = async () => {
    try {
        const filePath = __dirname + '/HDBCarparkInformation.csv';

        const carParkRepository = AppDataSource.getRepository(CarPark);
        const parser = createReadStream(filePath)
            .pipe(parse({ columns: true, delimiter: ',' }));
        if((await carParkRepository.find()).length){
            return 
        }

        for await (const record of parser) {
            const {
                car_park_no,
                address,
                x_coord,
                y_coord,
                car_park_type,
                type_of_parking_system,
                short_term_parking,
                free_parking,
                night_parking,
                car_park_decks,
                gantry_height,
                car_park_basement
            } = record;

            if (!car_park_no) {
                console.warn('Skipping record with missing car_park_no:', record);
                continue;
            }

            const { latitude, longitude } = convertSvy21ToWgs84(parseFloat(x_coord), parseFloat(y_coord));

            const carPark = new CarPark();
            carPark.carParkNo = car_park_no;
            carPark.address = address || '';
            carPark.latitude = latitude;
            carPark.longitude = longitude;
            carPark.totalLots = parseInt(record.total_lots, 10) || 0;
            carPark.availableLots = parseInt(record.available_lots, 10) || 0;
            carPark.carParkType = car_park_type || '';
            carPark.typeOfParkingSystem = type_of_parking_system || '';

            // Map values to boolean
            carPark.shortTermParking = short_term_parking === 'YES' || short_term_parking === 'Y';
            carPark.freeParking = free_parking === 'YES' || free_parking === 'Y';
            carPark.nightParking = night_parking === 'YES' || night_parking === 'Y';
            carPark.carParkDecks = parseInt(car_park_decks, 10) || 0;
            carPark.gantryHeight = parseFloat(gantry_height) || 0;
            carPark.carParkBasement = car_park_basement === 'YES' || car_park_basement === 'Y';
            await carParkRepository.save(carPark);
            console.log('Car park data loaded successfully');
        }
    } catch (error) {
        console.log("errir", error)
    }

};

