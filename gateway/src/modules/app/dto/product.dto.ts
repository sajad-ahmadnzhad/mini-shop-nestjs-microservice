import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber, IsPositive, IsString, Length } from "class-validator"

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @Length(10, 100)
    title: string

    @ApiProperty()
    @IsString()
    @Length(10, 500)
    description: string

    @ApiProperty()
    @Transform(({ value }) => +value)
    @IsNumber()
    @IsPositive()
    count: number
}