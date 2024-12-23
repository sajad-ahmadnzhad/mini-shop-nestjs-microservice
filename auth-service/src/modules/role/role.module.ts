import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  controllers: [RoleController],
  providers: [RoleService, AuthService],
  exports: [RoleService, TypeOrmModule]
})
export class RoleModule { }
