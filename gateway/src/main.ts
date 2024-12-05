import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './modules/app/app.module';
import { swaggerConfigInit } from './configs/swagger.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const logger = new Logger('NestApplication')

  //* Config swagger
  swaggerConfigInit(app)

  const { PORT = 4504 } = process.env

  await app.listen(PORT, () => {
    logger.log(`nest application is running on port ${PORT}`)
  });
}
bootstrap();
