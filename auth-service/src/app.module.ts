import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import envConfig from './configs/env.config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig()),
    ConfigModule.forRoot(envConfig()),
    JwtModule.register({
      global: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
