import { Controller, Post, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../rbac/guards/rbac.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';

@Controller('migrations')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post('run')
  @Roles('admin')
  async runMigrations() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Migrations cannot be run via API in production');
    }
    await this.migrationService.runMigrations();
    return { message: 'Migrations körda' };
  }

  @Get('status')
  @Roles('admin')
  async getStatus() {
    return { message: 'Migration status endpoint - implementera vid behov' };
  }
}
