import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerConfigInit(app)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
