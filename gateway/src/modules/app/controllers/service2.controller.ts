import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('service2')
@ApiTags('service2')
export class Service2Controller {}
