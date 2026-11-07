import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    return this.prisma.platformSettings.findUnique({ where: { id: 'default' } });
  }

  async update(
    data: {
      platformFeePercent?: number;
      processorFeePercent?: number;
      minDonationAmount?: number;
    },
    adminId: string,
  ) {
    return this.prisma.platformSettings.update({
      where: { id: 'default' },
      data: {
        platformFeePercent: data.platformFeePercent != null
          ? new Decimal(data.platformFeePercent)
          : undefined,
        processorFeePercent: data.processorFeePercent != null
          ? new Decimal(data.processorFeePercent)
          : undefined,
        minDonationAmount: data.minDonationAmount != null
          ? new Decimal(data.minDonationAmount)
          : undefined,
        updatedById: adminId,
      },
    });
  }
}
