import { HttpStatus } from "@nestjs/common"

export const sendError = (error: any) => {
    return {
        message: error.message || "Internal product service error",
        error: true,
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR
    }
}