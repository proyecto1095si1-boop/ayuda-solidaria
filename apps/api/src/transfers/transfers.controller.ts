import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('transfers')
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar transferencias' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.transfersService.findAll({ page, limit, campaignId });
  }

  @Post()
  @ApiOperation({ summary: 'Registrar transferencia a beneficiario' })
  async create(
    @Body() body: {
      campaignId: string;
      amount: number;
      operationNumber?: string;
      receiptUrl?: string;
      notes?: string;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.transfersService.create({ ...body, adminId });
  }
}
