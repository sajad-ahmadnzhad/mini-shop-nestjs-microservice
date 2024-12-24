import { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";

export default (): ConfigModuleOptions => {
    return {
        isGlobal: true,
        envFilePath: process.cwd() + "/.env",
        validate: (config: Record<string, any>) => {
            const schema = Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                DB_SYNCHRONIZE: Joi.string().required(),
            }).unknown(true)

            const { error, value } = schema.validate(config)

            if (error) {
                console.error('Env validation error:', error)
                process.exit(1)
            }

            return value
        }
    }
}