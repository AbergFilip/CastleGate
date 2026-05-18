import { Module } from '@nestjs/common';
import { LantmaterietService } from './lantmateriet.service';

@Module({
  providers: [LantmaterietService],
  exports: [LantmaterietService],
})
export class LantmaterietModule {}
