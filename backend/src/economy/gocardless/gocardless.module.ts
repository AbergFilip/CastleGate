import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoCardlessService } from './gocardless.service';

@Module({
  imports: [ConfigModule],
  providers: [GoCardlessService],
  exports: [GoCardlessService],
})
export class GoCardlessModule {}
