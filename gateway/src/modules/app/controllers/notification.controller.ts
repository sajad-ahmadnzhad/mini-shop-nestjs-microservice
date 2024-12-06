import { Controller, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
    constructor(@Inject('NOTIFICATION_SERVICE') private readonly notificationServiceClientProxy: ClientProxy) { }



}