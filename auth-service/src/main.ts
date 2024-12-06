import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport, RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: "auth-service",
      queueOptions: {
        durable: false
      }
    }
  } as RmqOptions);

  const logger = new Logger("NestApplication")

  await app.listen();
  logger.log('Auth service is running')
}
bootstrap();
