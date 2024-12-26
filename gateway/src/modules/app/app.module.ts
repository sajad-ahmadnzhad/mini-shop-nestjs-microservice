import { Module, ValidationPipe } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import envConfig from '../../configs/env.config';
import { ProductController } from './controllers/product.controller';
import { AuthController } from './controllers/auth.controller';
import { APP_PIPE } from '@nestjs/core';
import { GoogleStrategy } from '../../common/strategic/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: "AUTH_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queueOptions: {
              durable: true,
            },
            queue: process.env.RABBITMQ_AUTH_SERVICE_QUEUE,
            persistent: true,
            noAck: true,
            prefetchCount: 2,
            isGlobalPrefetchCount: true
          }
        },
        {
          name: "PRODUCT_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_PRODUCT_SERVICE_QUEUE,
            queueOptions: {
              durable: true,
            },
            persistent: true,
            noAck: true,
            prefetchCount: 2,
            isGlobalPrefetchCount: true
          }
        },
        {
          name: "NOTIFICATION_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: "notification-service",
            queueOptions: {
              durable: false,
            }
          }
        },
      ]
    })
  ],
  controllers: [ProductController, AuthController],
  providers: [GoogleStrategy, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ whitelist: true })
  }],
})
export class AppModule { }
