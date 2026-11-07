import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener configuración pública de comisiones' })
  async get() {
    const s = await this.settingsService.get();
    return {
      platformFeePercent: s?.platformFeePercent,
      processorFeePercent: s?.processorFeePercent,
      minDonationAmount: s?.minDonationAmount,
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar comisiones (solo admin)' })
  async update(
    @Body() body: {
      platformFeePercent?: number;
      processorFeePercent?: number;
      minDonationAmount?: number;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.settingsService.update(body, adminId);
  }
}
