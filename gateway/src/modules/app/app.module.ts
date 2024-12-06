import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import envConfig from 'src/configs/env.config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: "ORDER_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: "order-service",
            queueOptions: {
              durable: false,
            }
          }
        },
        {
          name: "PAYMENT_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: "payment-service",
            queueOptions: {
              durable: false,
            }
          }
        },
        {
          name: "NOTIFICATION_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: "notification-service",
            queueOptions: {
              durable: false,
            }
          }
        },
        {
          name: "INVENTORY_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: "inventory-service",
            queueOptions: {
              durable: false,
            }
          }
        },
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
