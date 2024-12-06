import { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";

export default (): ConfigModuleOptions => {
    return {
        isGlobal: true,
        envFilePath: process.cwd() + "/.env",
        validate: (config: Record<string, any>) => {
            const schema = Joi.object({
                GMAIL_USER: Joi.string().required(),
                GMAIL_PASS: Joi.string().required(),
                ACCESS_TOKEN_SECRET: Joi.string().required(),
                REFRESH_TOKEN_SECRET: Joi.string().required(),
                ACCESS_TOKEN_EXPIRE_TIME: Joi.string().required(),
                REFRESH_TOKEN_EXPIRE_TIME: Joi.string().required(),
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_CLIENT_SECRET: Joi.string().required(),
                GOOGLE_CALLBACK_URL: Joi.string().required(),
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