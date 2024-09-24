import { Kafka } from 'kafkajs';
import { AppDataSource } from '../utils/data-source';
import { CarPark } from '../entities/carparking.entity';

const kafka = new Kafka({
  clientId: 'carpark-service',
  brokers: [process.env.KAFKA_BROKER||'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'carpark-group' });

export const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'park_availability_topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message ,pause}) => {
      try {
        
      } catch (error) {
        
      }
    console.log("Message from kafka ",message.value?.toString())
    if(!message.value) return
      const carParkData = JSON.parse(message.value.toString());
      const repository = AppDataSource.getRepository(CarPark);

      const carPark = await repository.findOne({ where: { carParkNo:carParkData.carParkId} });
      if (carPark) {
        carPark.availableLots = carParkData.availableLots;
        await repository.save(carPark);
      }
    },
  });

  console.log('Kafka consumer started');
};
