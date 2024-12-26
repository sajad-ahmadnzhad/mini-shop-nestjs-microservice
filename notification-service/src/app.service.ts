import { Injectable } from "@nestjs/common";
import { ISendMail } from "./interfaces/send-mail.interface";
import * as nodemailer from "nodemailer";
import { RmqContext } from "@nestjs/microservices";
import { Channel } from "amqp-connection-manager";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class AppService {
  private transport: nodemailer.Transporter;

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
    const message = context.getMessage();
    const channel = context.getChannelRef() as Channel;
    console.log(message);
    try {
      const { GMAIL_USER } = process.env;

      // await this.transport.sendMail({ ...payload, from: GMAIL_USER });

      channel.ack(message);
      console.log("Email sended successfully");

    } catch (error) {
      channel.ack(message)
      console.error("Send email error:", error);
    }
  }

 async getRetryCount(messageId: string) {
    const retryCount = await this.redis.get(messageId)
    return retryCount ? Number.parseInt(retryCount , 10) : 0
  }

}
