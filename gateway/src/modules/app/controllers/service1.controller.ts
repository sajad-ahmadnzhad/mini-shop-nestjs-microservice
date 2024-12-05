import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('service1')
@ApiTags('service1')
export class Service1Controller { }
