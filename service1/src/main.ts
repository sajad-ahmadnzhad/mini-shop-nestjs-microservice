import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      queue: 'service1',
      queueOptions: {
        durable: false
      }
    }
  } as RmqOptions)

  const logger = new Logger('NestApplication')

  await app.listen()
  logger.log('Service 1 is running')

}
bootstrap();
