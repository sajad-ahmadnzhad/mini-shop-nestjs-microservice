import { Controller, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";

@Controller('inventory')
@ApiTags('inventory')
export class InventoryController {
    constructor(@Inject('INVENTORY_SERVICE') private readonly inventoryServiceClientProxy: ClientProxy) { }



}