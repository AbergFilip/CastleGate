import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TinkService } from './tink.service';

@Module({
  imports: [ConfigModule],
  providers: [TinkService],
  exports: [TinkService],
})
export class TinkModule {}
