import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { sendError } from "src/common/utils/functions.utils";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async findAll() {
    try {
      const users = await this.userRepository.find();

      return {
        message: "",
        error: false,
        status: HttpStatus.OK,
        data: { users },
      };
    } catch (error) {
      return sendError(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException("User not found");

      return {
        message: "",
        error: false,
        status: HttpStatus.OK,
        data: { user },
      };
    } catch (error) {
      return sendError(error);
    }
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
