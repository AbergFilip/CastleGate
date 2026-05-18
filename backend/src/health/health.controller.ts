import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  check() {
    return { ok: true, message: 'API is running' };
  }

  @Get('properties-sandbox')
  @Public()
  propertiesSandbox() {
    return { ok: true, message: 'properties sandbox route works' };
  }
}
