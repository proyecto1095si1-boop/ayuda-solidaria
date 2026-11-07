import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
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
}
