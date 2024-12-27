import { Injectable, Scope, Logger } from "@nestjs/common";
import { ISendMail } from "./interfaces/send-mail.interface";
import * as nodemailer from "nodemailer";
import { Channel } from "amqp-connection-manager";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { RmqContext } from "@nestjs/microservices";

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  private transport: nodemailer.Transporter;
  private RETRY_LIMIT: number = Number.parseInt(
    process.env.RABBITMQ_RETRY_COUNT
  );
  private logger: Logger = new Logger(AppService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {
    const { GMAIL_HOST, GMAIL_USER, GMAIL_PASS, GMAIL_PORT } = process.env;

    this.transport = nodemailer.createTransport({
      secure: false,
      service: "gmail",
      host: GMAIL_HOST,
      port: +GMAIL_PORT,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });
  }

  async sendWithMail(payload: ISendMail, context: RmqContext): Promise<void> {
    const originalMessage = context.getMessage();
    const channel = context.getChannelRef() as Channel;
    const { messageId, ...mailOptions } = payload;

    if (!messageId) {
      this.logger.warn("message does not have a messageId");
      return channel.ack(originalMessage);
    }

    try {
      const { GMAIL_USER } = process.env;
      const retryCount = await this.getRetryCount(messageId);

      if (retryCount >= this.RETRY_LIMIT) {
        this.logger.warn(`Retry limit exceeded for message: ${messageId}`);
        channel.ack(originalMessage);
        await this.clearRetryCount(messageId);
        return;
      }

      this.logger.debug(
        `Sending email processing with messageId: ${messageId}.....`
      );
      await this.transport.sendMail({ ...mailOptions, from: GMAIL_USER });

      this.logger.log(`Processing message: ${messageId}`);
      channel.ack(originalMessage);
      await this.clearRetryCount(messageId);
    } catch (error) {
      this.logger.error(`Error processing message: ${error}`);
      await this.incrementRetryCount(messageId);
    }
  }

  async getRetryCount(messageId: string): Promise<number> {
    this.logger.debug(`Getting retry count with messageId: ${messageId}`);

    const retryCount = await this.redis.get(messageId);
    return retryCount ? Number.parseInt(retryCount, 10) : 0;
  }

  async incrementRetryCount(messageId: string) {
    this.logger.debug(`incrementing retry count with messageId: ${messageId}`);
    await this.redis.incr(messageId);
    await this.redis.expire(messageId, 86400); //* One day
  }

  clearRetryCount(messageId: string) {
    this.logger.debug(`Clearing retry count with messageId: ${messageId}`);
    return this.redis.del(messageId);
  }
}
