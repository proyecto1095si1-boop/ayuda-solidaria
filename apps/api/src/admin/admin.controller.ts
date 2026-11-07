import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { ExportsService } from './exports.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, CampaignStatus } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private campaignsService: CampaignsService,
    private exportsService: ExportsService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard general del administrador' })
  async dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Listar todas las campañas' })
  async listCampaigns(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: CampaignStatus,
  ) {
    return this.adminService.listCampaigns({ page, limit, status });
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Detalle completo de campaña (admin)' })
  async getCampaign(@Param('id') id: string) {
    return this.campaignsService.findOneAdmin(id);
  }

  @Patch('campaigns/:id/status')
  @ApiOperation({ summary: 'Cambiar estado de campaña' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: CampaignStatus; rejectionReason?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.campaignsService.updateStatus(
      id,
      body.status,
      adminId,
      body.rejectionReason,
    );
  }

  @Patch('campaigns/:id/feature')
  @ApiOperation({ summary: 'Destacar / quitar destacado' })
  async toggleFeatured(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.campaignsService.toggleFeatured(id, adminId);
  }

  // ─── Exportaciones ───────────────────────────────────────────

  @Get('exports/donations')
  @ApiOperation({ summary: 'Exportar donaciones (CSV o Excel)' })
  @ApiQuery({ name: 'format', enum: ['csv', 'excel'], required: false })
  async exportDonations(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Res() res: Response,
  ) {
    if (format === 'excel') {
      const buffer = await this.exportsService.exportDonationsExcel();
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="donaciones-${Date.now()}.xlsx"`,
      });
      return res.send(buffer);
    }

    const csv = await this.exportsService.exportDonationsCsv();
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="donaciones-${Date.now()}.csv"`,
    });
    // BOM para que Excel abra bien los acentos
    return res.send('\uFEFF' + csv);
  }

  @Get('exports/transfers')
  @ApiOperation({ summary: 'Exportar transferencias (CSV)' })
  async exportTransfers(@Res() res: Response) {
    const csv = await this.exportsService.exportTransfersReport();
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="transferencias-${Date.now()}.csv"`,
    });
    return res.send('\uFEFF' + csv);
  }
}
