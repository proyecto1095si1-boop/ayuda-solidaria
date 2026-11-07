import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Decimal } from '@prisma/client/runtime/library';
import { TransferStatus } from '@prisma/client';

@Injectable()
export class TransfersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(data: {
    campaignId: string;
    amount: number;
    operationNumber?: string;
    receiptUrl?: string;
    notes?: string;
    adminId: string;
  }) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: data.campaignId },
      include: { beneficiary: true },
    });

    if (!campaign) throw new NotFoundException('Campaña no encontrada');

    const available = Number(campaign.netRaised);
    // Simplificado: no restamos transferencias previas aquí (se puede mejorar)
    if (data.amount > available) {
      throw new BadRequestException(
        `Monto supera lo recaudado neto disponible ($${available})`,
      );
    }

    const transfer = await this.prisma.transfer.create({
      data: {
        campaignId: data.campaignId,
        beneficiaryId: campaign.beneficiaryId,
        amount: new Decimal(data.amount),
        status: TransferStatus.COMPLETED,
        operationNumber: data.operationNumber,
        receiptUrl: data.receiptUrl,
        notes: data.notes,
        transferredById: data.adminId,
        transferredAt: new Date(),
      },
    });

    await this.audit.log({
      userId: data.adminId,
      action: 'TRANSFER_COMPLETED',
      entityType: 'Transfer',
      entityId: transfer.id,
      metadata: {
        campaignId: data.campaignId,
        amount: data.amount,
        beneficiary: campaign.beneficiary.fullName,
      },
    });

    return transfer;
  }

  async findAll(params: { page?: number; limit?: number; campaignId?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.campaignId) where.campaignId = params.campaignId;

    const [items, total] = await Promise.all([
      this.prisma.transfer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          campaign: { select: { id: true, title: true } },
          beneficiary: {
            select: { id: true, fullName: true, cbu: true, alias: true },
          },
        },
      }),
      this.prisma.transfer.count({ where }),
    ]);

    return { items, meta: { total, page, limit } };
  }
}
