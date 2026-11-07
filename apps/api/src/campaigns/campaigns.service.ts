import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(userId: string, dto: CreateCampaignDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.BENEFICIARY) {
      throw new ForbiddenException('Solo beneficiarios pueden crear campañas');
    }

    if (!user.dni || !user.cbu) {
      throw new BadRequestException(
        'Debes completar tu DNI y datos bancarios antes de crear una campaña',
      );
    }

    let slug = slugify(dto.title);
    const existing = await this.prisma.campaign.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        title: dto.title,
        slug,
        category: dto.category,
        goalAmount: new Decimal(dto.goalAmount),
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        story: dto.story,
        description: dto.description,
        reason: dto.reason,
        mainImageUrl: dto.mainImageUrl,
        status: CampaignStatus.PENDING,
        beneficiaryId: userId,
        media: dto.mediaUrls?.length
          ? {
              create: dto.mediaUrls.map((url, i) => ({
                url,
                type: url.includes('video') || url.includes('.mp4') ? 'video' : 'image',
                order: i,
              })),
            }
          : undefined,
        documents: dto.documentUrls?.length
          ? {
              create: dto.documentUrls.map((doc) => ({
                url: doc.url,
                name: doc.name,
                type: doc.type || 'respaldo',
              })),
            }
          : undefined,
      },
      include: {
        media: true,
        documents: true,
        beneficiary: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    await this.audit.log({
      userId,
      action: 'CAMPAIGN_CREATED',
      entityType: 'Campaign',
      entityId: campaign.id,
      metadata: { title: campaign.title },
    });

    return campaign;
  }

  async findAllPublic(params: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 12, 50);
    const skip = (page - 1) * limit;

    const where: any = {
      status: CampaignStatus.APPROVED,
    };

    if (params.category) where.category = params.category;
    if (params.featured) where.isFeatured = true;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          beneficiary: {
            select: { id: true, fullName: true, avatarUrl: true, city: true, province: true },
          },
          media: { orderBy: { order: 'asc' }, take: 5 },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    // Solo devolvemos montos netos al público
    return {
      items: items.map((c) => this.toPublic(c)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { slug },
      include: {
        beneficiary: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            city: true,
            province: true,
          },
        },
        media: { orderBy: { order: 'asc' } },
        documents: false, // no públicos
        donations: {
          where: { status: 'APPROVED' },
          orderBy: { paidAt: 'desc' },
          take: 20,
          select: {
            id: true,
            donorName: true,
            message: true,
            netAmount: true,
            paidAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!campaign || campaign.status !== CampaignStatus.APPROVED) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return this.toPublic(campaign);
  }

  async findMyCampaigns(userId: string) {
    return this.prisma.campaign.findMany({
      where: { beneficiaryId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        media: { take: 1 },
        _count: { select: { donations: true } },
      },
    });
  }

  async findOneAdmin(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        beneficiary: true,
        media: true,
        documents: true,
        donations: {
          orderBy: { createdAt: 'desc' },
          include: { donor: { select: { id: true, fullName: true, email: true } } },
        },
        transfers: true,
      },
    });

    if (!campaign) throw new NotFoundException('Campaña no encontrada');
    return campaign;
  }

  async updateStatus(
    id: string,
    status: CampaignStatus,
    adminId: string,
    rejectionReason?: string,
  ) {
    const campaign = await this.findOneAdmin(id);

    const data: any = { status };

    if (status === CampaignStatus.APPROVED) {
      data.approvedAt = new Date();
      data.rejectionReason = null;
    }
    if (status === CampaignStatus.REJECTED) {
      data.rejectionReason = rejectionReason || 'No cumple los requisitos';
    }
    if (status === CampaignStatus.FINISHED) {
      data.finishedAt = new Date();
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data,
    });

    await this.audit.log({
      userId: adminId,
      action: `CAMPAIGN_${status}`,
      entityType: 'Campaign',
      entityId: id,
      metadata: { previousStatus: campaign.status, rejectionReason },
    });

    return updated;
  }

  async toggleFeatured(id: string, adminId: string) {
    const campaign = await this.findOneAdmin(id);
    const updated = await this.prisma.campaign.update({
      where: { id },
      data: { isFeatured: !campaign.isFeatured },
    });

    await this.audit.log({
      userId: adminId,
      action: updated.isFeatured ? 'CAMPAIGN_FEATURED' : 'CAMPAIGN_UNFEATURED',
      entityType: 'Campaign',
      entityId: id,
    });

    return updated;
  }

  async update(id: string, userId: string, dto: UpdateCampaignDto, isAdmin = false) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException();

    if (!isAdmin && campaign.beneficiaryId !== userId) {
      throw new ForbiddenException();
    }

    if (!isAdmin && campaign.status === CampaignStatus.APPROVED) {
      throw new BadRequestException('No se puede editar una campaña ya aprobada');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        title: dto.title,
        category: dto.category,
        goalAmount: dto.goalAmount ? new Decimal(dto.goalAmount) : undefined,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        story: dto.story,
        description: dto.description,
        reason: dto.reason,
        mainImageUrl: dto.mainImageUrl,
      },
    });
  }

  private toPublic(campaign: any) {
    const {
      grossRaised,
      documents,
      beneficiary,
      ...rest
    } = campaign;

    return {
      ...rest,
      // Solo monto neto público
      raised: campaign.netRaised,
      goalAmount: campaign.goalAmount,
      progressPercent: campaign.goalAmount.gt(0)
        ? Math.min(
            100,
            Number(campaign.netRaised) / Number(campaign.goalAmount) * 100,
          )
        : 0,
      beneficiary: beneficiary
        ? {
            id: beneficiary.id,
            fullName: beneficiary.fullName,
            avatarUrl: beneficiary.avatarUrl,
            city: beneficiary.city,
            province: beneficiary.province,
          }
        : undefined,
    };
  }
}
