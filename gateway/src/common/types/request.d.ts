declare global {
    namespace Express {
        interface Request {
            [key: string]: string
            id: number
        }
    }
}