import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, DonationStatus } from '@prisma/client';

@ApiTags('Donations')
@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear donación (puede ser anónima)' })
  async create(
    @Body() dto: CreateDonationDto,
    @Req() req: Request,
    @CurrentUser('id') donorId?: string,
  ) {
    // JwtAuthGuard no es obligatorio → donorId puede ser undefined
    return this.donationsService.create(dto, donorId, {
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook de Mercado Pago' })
  async webhook(@Body() body: any) {
    return this.donationsService.handleWebhook(body);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las donaciones (admin)' })
  async findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('campaignId') campaignId?: string,
    @Query('status') status?: DonationStatus,
  ) {
    return this.donationsService.findAllAdmin({ page, limit, campaignId, status });
  }
}
