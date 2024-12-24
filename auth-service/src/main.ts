import { NestFactory } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { Logger } from '@nestjs/common';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { config } from 'dotenv'
config()

async function bootstrap() {
  const app = await NestFactory.createMicroservice<RmqOptions>(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBITMQ_QUEUE,
    }
  });

  const logger = new Logger("NestApplication")

  await app.listen();
  logger.log('Auth service is running')
}
bootstrap();
