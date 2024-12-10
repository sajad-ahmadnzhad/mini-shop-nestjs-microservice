import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";

export default (): CacheModuleAsyncOptions => {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env
    return {
        isGlobal: true,
        async useFactory() {
            const store = await redisStore({
                socket: {
                    host: REDIS_HOST,
                    port: +REDIS_PORT
                },
                password: REDIS_PASSWORD
            })

            return { store }
        }
    }
}