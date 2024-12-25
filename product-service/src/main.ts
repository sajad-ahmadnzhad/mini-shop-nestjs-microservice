import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv'
config()

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProductModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBITMQ_QUEUE_NAME,
    }
  } as RmqOptions);

  const logger = new Logger("NestApplication")

  await app.listen();
  logger.log('Product service is running')
}
bootstrap();
