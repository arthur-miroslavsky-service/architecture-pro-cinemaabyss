import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumer.name);

  async onModuleInit() {
    const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');

    const kafka = new Kafka({
      clientId: 'events-service-consumer',
      brokers,
    });

    const consumer = kafka.consumer({
      groupId: 'events-service-group',
    });

    await consumer.connect();

    await consumer.subscribe({ topic: 'movie-events', fromBeginning: true });
    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });
    await consumer.subscribe({ topic: 'payment-events', fromBeginning: true });

    await consumer.run({
      // eslint-disable-next-line @typescript-eslint/require-await
      eachMessage: async ({ topic, message }) => {
        const value = message.value?.toString() ?? '';
        this.logger.log(`Processed event from topic "${topic}": ${value}`);
      },
    });
  }
}
