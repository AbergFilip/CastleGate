import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetsService {
  async getAssets(userId: string): Promise<{ assets: any[]; total: number }> {
    // Return empty list until we aggregate from properties/vehicles/boats or add assets table
    return { assets: [], total: 0 };
  }
}
