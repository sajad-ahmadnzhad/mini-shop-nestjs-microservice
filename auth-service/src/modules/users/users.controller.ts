import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("get-users")
  findAll() {
    return this.usersService.findAll();
  }

  findOne(id: string) {
    return this.usersService.findOne(+id);
  }

  update(id: string) {
    return this.usersService.update(+id);
  }

  remove(id: string) {
    return this.usersService.remove(+id);
  }
}
