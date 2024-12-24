import { Transform } from "class-transformer"
import { ArrayUnique, IsArray, IsEmail, IsEnum, IsJWT, IsLowercase, IsNotEmpty, IsString, Length } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'
import { Action, Resource } from "../enums/user.enum"

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

export class SignoutDto extends RefreshTokenDto { }



export class CreateRoleDto {
    @ApiProperty({ type: 'string', nullable: false })
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    @Transform(({ value }) => value?.trim())
    name: string
}

export class CreatePermissionDto {
    @ApiProperty({ type: 'string', nullable: false, enum: Resource })
    @IsEnum(Resource)
    @IsNotEmpty()
    @IsString()
    resource: Resource

    @ApiProperty({ type: 'array', nullable: false, isArray: true, uniqueItems: true, items: { nullable: false, type: "string", enum: ['create', 'read', 'update', 'delete'] } })
    @IsEnum(Action, { each: true })
    @IsNotEmpty()
    @IsArray()
    @ArrayUnique()
    actions: Action[]
}