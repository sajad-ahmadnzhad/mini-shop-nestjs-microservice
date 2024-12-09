import { HttpStatus } from "@nestjs/common"

export type ServiceResponse = {
    message: string
    error: boolean
    status: HttpStatus,
    data: object | null
}