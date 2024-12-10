import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISignup } from './interfaces/signup.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { ISignin } from './interfaces/signin.interface';
import { sendError } from './common/utils/functions.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';

@Injectable()
export class AppService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly redisCache: RedisCache
  ) { }

  async setRefreshTokenInRedis(userId: number, refreshToken: string) {
    const cacheKey = `refreshToken_${userId}_${refreshToken}`
    await this.redisCache.set(cacheKey, refreshToken)
  }

  async generateTokens(user: User) {
    const {
      ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRE_TIME,
      REFRESH_TOKEN_EXPIRE_TIME
    } = process.env


    const accessToken = this.jwtService.sign({ id: user.id }, { secret: ACCESS_TOKEN_SECRET, expiresIn: ACCESS_TOKEN_EXPIRE_TIME })
    const refreshToken = this.jwtService.sign({ id: user.id }, { secret: REFRESH_TOKEN_SECRET, expiresIn: REFRESH_TOKEN_EXPIRE_TIME })


    await this.setRefreshTokenInRedis(user.id, refreshToken)

    return { accessToken, refreshToken }
  }

  async signup(dto: ISignup) {

    try {
      const { email, username, password } = dto

      const existingUser = await this.userRepository.findOne({ where: [{ email }, { username }] })

      if (existingUser)
        throw new ConflictException('already signup with this username or email')

      const hashPassword = await bcrypt.hash(password, 10)

      const user = this.userRepository.create({ ...dto, password: hashPassword })

      await this.userRepository.save(user)

      const tokens = await this.generateTokens(user)

      return {
        message: 'successfully signup',
        error: false,
        status: HttpStatus.CREATED,
        data: { ...tokens }
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async signin(dto: ISignin) {
    try {
      const { identifier, password } = dto

      const existingUser = await this.userRepository.findOne({
        where: [{ username: identifier }, { email: identifier }],
        select: { password: true, id: true }
      })

      if (!existingUser)
        throw new NotFoundException('User not found')


      const isValidPassword = await bcrypt.compare(password, existingUser.password)

      if (!isValidPassword) {
        throw new BadRequestException('Invalid identifier or password')
      }

      const tokens = await this.generateTokens(existingUser)

      return {
        message: 'successfully signin',
        error: false,
        status: HttpStatus.OK,
        data: { ...tokens }
      }

    } catch (error) {
      return sendError(error)
    }
  }

  protected async validateRefreshToken(refreshToken: string): Promise<boolean> {
    const { id } = this.jwtService.decode<{ id: number }>(refreshToken) || {}
    const cacheKey = `refreshToken_${id}_${refreshToken}`
    const storedToken = await this.redisCache.get(cacheKey)

    if (!storedToken || storedToken !== refreshToken) {
      throw new BadRequestException('invalid refresh token')
    }

    return true
  }

  async refreshToken(refreshToken: string) {
    try {
      await this.validateRefreshToken(refreshToken)

      const { id } = this.jwtService.verify<{ id: number }>(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET as string
      })

      const newAccessToken = this.jwtService.sign({ id }, {
        secret: process.env.ACCESS_TOKEN_SECRET as string,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME as string
      })


      return {
        message: 'refreshed token success',
        error: false,
        status: HttpStatus.CREATED,
        data: { newAccessToken }
      }
    } catch (error) {
      return sendError(error)
    }

  }

}
