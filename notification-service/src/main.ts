import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { Transport, RmqOptions } from "@nestjs/microservices";
import { config } from "dotenv";
config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBITMQ_QUEUE_NAME,
      queueOptions: {
        durable: false,
      },
      noAck: false,
    },
  } as RmqOptions);

  const logger = new Logger("NestApplication");

  await app.listen();
  logger.log("Notification service is running");
}
bootstrap();
