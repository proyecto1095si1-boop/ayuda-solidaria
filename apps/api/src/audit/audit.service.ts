import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    userId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata || undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }

  async findAll(params: { page?: number; limit?: number; action?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.action) where.action = params.action;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, meta: { total, page, limit } };
  }
}
