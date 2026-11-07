import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignStatus, DonationStatus, TransferStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalGross,
      totalPlatformFees,
      totalProcessorFees,
      totalTransferred,
      activeCampaigns,
      pendingCampaigns,
      finishedCampaigns,
      totalUsers,
      totalDonors,
      recentDonations,
    ] = await Promise.all([
      this.prisma.donation.aggregate({
        where: { status: DonationStatus.APPROVED },
        _sum: { grossAmount: true },
      }),
      this.prisma.donation.aggregate({
        where: { status: DonationStatus.APPROVED },
        _sum: { platformFee: true },
      }),
      this.prisma.donation.aggregate({
        where: { status: DonationStatus.APPROVED },
        _sum: { processorFee: true },
      }),
      this.prisma.transfer.aggregate({
        where: { status: TransferStatus.COMPLETED },
        _sum: { amount: true },
      }),
      this.prisma.campaign.count({ where: { status: CampaignStatus.APPROVED } }),
      this.prisma.campaign.count({
        where: { status: { in: [CampaignStatus.PENDING, CampaignStatus.UNDER_REVIEW] } },
      }),
      this.prisma.campaign.count({ where: { status: CampaignStatus.FINISHED } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'DONOR' } }),
      this.prisma.donation.findMany({
        where: { status: DonationStatus.APPROVED },
        orderBy: { paidAt: 'desc' },
        take: 10,
        include: {
          campaign: { select: { title: true, slug: true } },
          donor: { select: { fullName: true } },
        },
      }),
    ]);

    return {
      totalRaised: totalGross._sum.grossAmount || new Decimal(0),
      totalPlatformFees: totalPlatformFees._sum.platformFee || new Decimal(0),
      totalProcessorFees: totalProcessorFees._sum.processorFee || new Decimal(0),
      totalTransferred: totalTransferred._sum.amount || new Decimal(0),
      campaigns: {
        active: activeCampaigns,
        pending: pendingCampaigns,
        finished: finishedCampaigns,
      },
      users: {
        total: totalUsers,
        donors: totalDonors,
      },
      recentDonations,
    };
  }

  async listCampaigns(params: {
    page?: number;
    limit?: number;
    status?: CampaignStatus;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 50);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;

    const [items, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          beneficiary: {
            select: {
              id: true,
              fullName: true,
              email: true,
              dni: true,
              cbu: true,
              alias: true,
              phone: true,
            },
          },
          _count: { select: { donations: true } },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return { items, meta: { total, page, limit } };
  }
}
