import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISignup } from './interfaces/signup.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AppService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async signup(dto: ISignup) {

    try {
      const { email, username, password } = dto
      const {
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRE_TIME,
        REFRESH_TOKEN_EXPIRE_TIME
      } = process.env

      const existingUser = await this.userRepository.findOne({ where: [{ email }, { username }] })

      if (existingUser)
        throw new ConflictException('already signup with this username or email')

      const hashPassword = await bcrypt.hash(password, 10)

      const user = this.userRepository.create({ ...dto, password: hashPassword })

      await this.userRepository.save(user)

      const accessToken = this.jwtService.sign({ id: user.id }, { secret: ACCESS_TOKEN_SECRET, expiresIn: ACCESS_TOKEN_EXPIRE_TIME })
      const refreshToken = this.jwtService.sign({ id: user.id }, { secret: REFRESH_TOKEN_SECRET, expiresIn: REFRESH_TOKEN_EXPIRE_TIME })

      return {
        message: 'successfully signup',
        error: false,
        status: HttpStatus.CREATED,
        data: {
          accessToken,
          refreshToken
        }
      }
    } catch (error) {
      return {
        message: error.message || "Internal auth service error",
        error: true,
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
