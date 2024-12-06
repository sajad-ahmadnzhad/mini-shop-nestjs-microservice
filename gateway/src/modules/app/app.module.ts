import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import envConfig from '../../configs/env.config';
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { NotificationController } from './controllers/notification.controller';
import { InventoryController } from './controllers/inventory.controller';
import { AuthController } from './controllers/auth.controller';
import { APP_PIPE } from '@nestjs/core';

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
            urls: ['amqp://localhost:5672'],
            queue: "auth-service",
            queueOptions: {
              durable: false,
            }
          }
        },
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
  controllers: [AppController, OrderController, PaymentController, NotificationController, InventoryController, AuthController],
  providers: [AppService, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ whitelist: true })
  }],
})
export class AppModule { }
