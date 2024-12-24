import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: "inventory-service",
      queueOptions: {
        durable: false
      }
    }
  } as RmqOptions);

  const logger = new Logger("NestApplication")

  await app.listen();
  logger.log('Inventory service is running')
}
bootstrap();
