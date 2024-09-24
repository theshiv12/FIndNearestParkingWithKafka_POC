import express from 'express';
import {
  findNearestParkingLot,
  getAllCarPark
} from '../controllers/carpark.controllers';


const router = express.Router();


router.post('/nearest',findNearestParkingLot );
router.get('/',getAllCarPark );



export default router;
