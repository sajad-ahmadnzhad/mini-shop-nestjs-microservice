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

  @MessagePattern("get-one-user")
  findOne(payload: {id: number}) {
    return this.usersService.findOne(payload.id);
  }

  update(id: string) {
    return this.usersService.update(+id);
  }

  remove(id: string) {
    return this.usersService.remove(+id);
  }
}
