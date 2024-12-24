import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RoleRepository } from './role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [RoleController],
  providers: [RoleService, AuthService, RoleRepository],
  exports: [RoleService, TypeOrmModule]
})
export class RoleModule { }
