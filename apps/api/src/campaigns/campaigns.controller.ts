import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, CampaignStatus } from '@prisma/client';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar campañas públicas aprobadas' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'featured', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
  ) {
    return this.campaignsService.findAllPublic({
      page,
      limit,
      category,
      featured: featured === 'true',
      search,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mis campañas (beneficiario)' })
  async myCampaigns(@CurrentUser('id') userId: string) {
    return this.campaignsService.findMyCampaigns(userId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Detalle de campaña pública por slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.campaignsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BENEFICIARY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva campaña' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar campaña propia' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, user.id, dto, user.role === Role.ADMIN);
  }
}
