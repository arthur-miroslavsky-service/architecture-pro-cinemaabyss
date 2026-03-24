import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaConsumer } from './kafka.consumer';

@Module({
  controllers: [AppController],
  providers: [AppService, KafkaConsumer],
})
export class AppModule {}
