import { Module } from '@nestjs/common';
import { Service1Controller } from './controllers/service1.controller';
import { Service2Controller } from './controllers/service2.controller';
import { ClientProxyFactory, RmqOptions, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [Service1Controller, Service2Controller],
  providers: [
    {
      provide: "SERVICE1",
      useFactory() {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'service1',
            queueOptions: {
              durable: false
            }
          }
        }) as RmqOptions
      },
      inject: []
    },
    {
      provide: "SERVICE2",
      useFactory() {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'service2',
            queueOptions: {
              durable: false
            }
          }
        }) as RmqOptions
      },
      inject: []
    }
  ]
})
export class GatewayModule { }
