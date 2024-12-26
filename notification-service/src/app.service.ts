import { Injectable } from "@nestjs/common";
import { ISendMail } from "./interfaces/send-mail.interface";
import * as nodemailer from "nodemailer";
import { RmqContext } from "@nestjs/microservices";
import { Channel } from "amqp-connection-manager";

@Injectable()
export class AppService {
  private transport: nodemailer.Transporter;

  constructor() {
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

      await this.transport.sendMail({ ...payload, from: GMAIL_USER });

      channel.ack(message);
      console.log("Email sended successfully");
    } catch (error) {
      console.error("Send email error:", error);

      const retryCount = message.properties.headers["x-retry-count"] || 0;
      console.log(retryCount);
      if (retryCount >= 3) channel.ack(message);

    }
  }
}
