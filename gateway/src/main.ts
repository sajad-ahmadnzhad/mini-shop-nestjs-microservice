import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './configs/swagger.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerConfigInit(app)

  const logger = new Logger("NestApplication")

  const { PORT = 4000 } = process.env

  await app.listen(PORT, () => {
    logger.log(`Gateway running on port ${PORT}`)
  });
}
bootstrap();
