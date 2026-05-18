import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { BoatsModule } from './boats/boats.module';
import { InsurancesModule } from './insurances/insurances.module';
import { InventoriesModule } from './inventories/inventories.module';
import { SandboxBankModule } from '../economy/sandbox-bank/sandbox-bank.module';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [
    PropertiesModule,
    SandboxBankModule,
    VehiclesModule,
    BoatsModule,
    InsurancesModule,
    InventoriesModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [
    PropertiesModule,
    VehiclesModule,
    BoatsModule,
    InsurancesModule,
    InventoriesModule,
  ],
})
export class AssetsModule {}

