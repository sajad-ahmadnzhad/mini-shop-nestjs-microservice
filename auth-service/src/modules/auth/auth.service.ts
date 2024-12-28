import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISignup } from './interfaces/signup.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { ISignin } from './interfaces/signin.interface';
import { sendError } from '../../common/utils/functions.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
import { IGoogleOauthUser } from './interfaces/googleOauth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly redisCache: RedisCache
  ) { }

  async setRefreshTokenInRedis(userId: number, refreshToken: string) {
    const cacheKey = `refreshToken_${userId}_${refreshToken}`
    await this.redisCache.set(cacheKey, refreshToken, 60 * 60 * 24 * 30 * 1000)
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


      const isValidPassword = await bcrypt.compare(password, existingUser.password || '')

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

  async googleRedirect(user: IGoogleOauthUser | undefined) {
    try {
      if (!user) throw new UnauthorizedException('The information entered is insufficient')

      const existingUser = await this.userRepository.findOne({
        where: [{ email: user.email }, { username: user.username }]
      })

      if (existingUser) {
        const tokens = await this.generateTokens(existingUser)
        return {
          message: "signin success",
          error: false,
          status: HttpStatus.OK,
          data: { ...tokens }
        }
      }

      const newUser = this.userRepository.create(user)

      await this.userRepository.save(newUser)

      const tokens = await this.generateTokens(newUser)

      return {
        message: "signup success",
        error: false,
        status: HttpStatus.CREATED,
        data: { ...tokens }
      }

    } catch (error) {
      return sendError(error)
    }
  }

  async signout(refreshToken: string) {
    try {
      await this.validateRefreshToken(refreshToken)

      const { REFRESH_TOKEN_SECRET } = process.env
      let decodeToken = this.jwtService.verify<{ id: number }>(refreshToken, { secret: REFRESH_TOKEN_SECRET })

      if (!decodeToken?.id) throw new BadRequestException('Invalid refresh token')

      await this.redisCache.del(`refreshToken_${decodeToken.id}_${refreshToken}`)

      return {
        message: "signout success",
        error: false,
        status: HttpStatus.OK,
        data: {}
      }
    } catch (error) {
      return sendError(error)
    }
  }

  async findOneAndThrow(args: FindOptionsWhere<User>) {
    const existingUser = await this.userRepository.findOneBy(args)

    if (!existingUser)
      throw new NotFoundException('User not found')

    return existingUser
  }

  async verifyToken(token: string) {
    try {
      const { ACCESS_TOKEN_SECRET } = process.env
      const verifyToken = await this.jwtService.verifyAsync(token, { secret: ACCESS_TOKEN_SECRET })

      if (!verifyToken?.id)
        throw new BadRequestException("Invalid token payload")

      await this.findOneAndThrow({ id: verifyToken.id })

      return {
        message: "verified token success",
        error: false,
        status: HttpStatus.OK,
        data: { userId: verifyToken.id }
      }
    } catch (error) {
      return sendError(error)
    }
  }
}
