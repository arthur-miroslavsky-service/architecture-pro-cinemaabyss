import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumer.name);

  async onModuleInit() {
    console.log('KafkaConsumer onModuleInit started');
    const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');

    const kafka = new Kafka({
      clientId: 'events-service-consumer',
      brokers,
    });

    const consumer = kafka.consumer({
      groupId: 'events-service-group',
    });

    console.log('Connecting consumer...');
    await consumer.connect();
    console.log('Consumer connected');

    await consumer.subscribe({ topic: 'movie-events', fromBeginning: true });
    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });
    await consumer.subscribe({ topic: 'payment-events', fromBeginning: true });
    console.log('Consumer subscribed');

    await consumer.run({
      // eslint-disable-next-line @typescript-eslint/require-await
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString() ?? '';
        console.log(`Processed event from topic "${topic}": ${value}`);
        this.logger.log(`Processed event from topic "${topic}": ${value}`);
      },
    });

    console.log('Consumer run started');
  }
}
