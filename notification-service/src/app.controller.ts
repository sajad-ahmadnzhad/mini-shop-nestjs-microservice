import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from "@nestjs/microservices";
import { ISendMail } from "./interfaces/send-mail.interface";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("send-notification", Transport.RMQ)
  sendNotification(@Payload() payload: ISendMail, @Ctx() context: RmqContext): void {
    this.appService.sendWithMail(payload, context);
  }
}
