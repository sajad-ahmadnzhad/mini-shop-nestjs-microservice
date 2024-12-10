import { Transform } from "class-transformer"
import { IsEmail, IsJWT, IsNotEmpty, IsString, Length } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class SignupDto {
    @ApiProperty({ type: "string", nullable: false, maxLength: 500, minLength: 3 })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Length(3, 500)
    full_name: string

    @ApiProperty({ type: "string", nullable: false, maxLength: 5, minLength: 50 })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Length(5, 50)
    username: string

    @ApiProperty({ type: "string", nullable: false })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email: string

    @ApiProperty({ type: "string", nullable: false, maxLength: 8, minLength: 32 })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Length(8, 32)
    password: string
}

export class SigninDto {
    @ApiProperty({ type: 'string', nullable: false })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    identifier: string

    @ApiProperty({ type: 'string', nullable: false, maxLength: 8, minLength: 32 })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Length(8, 32)
    password: string
}

export class RefreshTokenDto {
    @ApiProperty({ type: 'string', nullable: false })
    @IsNotEmpty()
    @IsString()
    @IsJWT()
    refreshToken: string
}