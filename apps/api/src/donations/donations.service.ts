import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CampaignStatus, DonationStatus } from '@prisma/client';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class DonationsService {
  private mpClient: MercadoPagoConfig | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private audit: AuditService,
  ) {
    const token = this.config.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    if (token) {
      this.mpClient = new MercadoPagoConfig({ accessToken: token });
    }
  }

  async create(dto: CreateDonationDto, donorId?: string, meta?: { ip?: string; ua?: string }) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
    });

    if (!campaign || campaign.status !== CampaignStatus.APPROVED) {
      throw new NotFoundException('Campaña no disponible para donaciones');
    }

    const settings = await this.prisma.platformSettings.findUnique({
      where: { id: 'default' },
    });

    const platformFeePercent = Number(settings?.platformFeePercent ?? 12);
    const processorFeePercent = Number(settings?.processorFeePercent ?? 6.4);
    const minAmount = Number(settings?.minDonationAmount ?? 500);

    if (dto.amount < minAmount) {
      throw new BadRequestException(`El monto mínimo de donación es $${minAmount}`);
    }

    const gross = new Decimal(dto.amount);
    const platformFee = gross.mul(platformFeePercent).div(100);
    const processorFee = gross.mul(processorFeePercent).div(100);
    const net = gross.sub(platformFee).sub(processorFee);

    const donation = await this.prisma.donation.create({
      data: {
        campaignId: dto.campaignId,
        donorId: donorId || null,
        donorName: dto.donorName || null,
        donorEmail: dto.donorEmail || null,
        message: dto.message || null,
        grossAmount: gross,
        platformFee,
        processorFee,
        netAmount: net,
        status: DonationStatus.PENDING,
        ipAddress: meta?.ip,
        userAgent: meta?.ua,
      },
    });

    // Crear preferencia de Mercado Pago
    if (!this.mpClient) {
      // Modo desarrollo sin MP configurado
      return {
        donation,
        checkoutUrl: null,
        message: 'Mercado Pago no configurado. Donación creada en estado PENDING.',
      };
    }

    const preference = new Preference(this.mpClient);
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const pref = await preference.create({
      body: {
        items: [
          {
            id: donation.id,
            title: `Donación - ${campaign.title}`,
            quantity: 1,
            unit_price: Number(gross),
            currency_id: 'ARS',
          },
        ],
        external_reference: donation.id,
        notification_url: `${this.config.get('API_URL') || 'http://localhost:3001'}/api/donations/webhook`,
        back_urls: {
          success: `${frontendUrl}/donacion/exito?id=${donation.id}`,
          failure: `${frontendUrl}/donacion/error?id=${donation.id}`,
          pending: `${frontendUrl}/donacion/pendiente?id=${donation.id}`,
        },
        auto_return: 'approved',
      },
    });

    await this.prisma.donation.update({
      where: { id: donation.id },
      data: { mercadopagoId: pref.id },
    });

    return {
      donation: { id: donation.id, netAmount: net },
      checkoutUrl: pref.init_point,
      preferenceId: pref.id,
    };
  }

  async handleWebhook(body: any) {
    // Procesar notificación de Mercado Pago
    // En producción validar firma con MERCADOPAGO_WEBHOOK_SECRET
    const externalRef = body?.data?.id || body?.external_reference;

    if (!externalRef) return { received: true };

    // Aquí se consulta el pago a MP y se actualiza el estado
    // Simplificado para el esqueleto:
    return { received: true };
  }

  async markAsPaid(donationId: string, mpData?: any) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { campaign: true },
    });

    if (!donation || donation.status === DonationStatus.APPROVED) {
      return donation;
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const d = await tx.donation.update({
        where: { id: donationId },
        data: {
          status: DonationStatus.APPROVED,
          paidAt: new Date(),
          mercadopagoData: mpData || undefined,
        },
      });

      await tx.campaign.update({
        where: { id: donation.campaignId },
        data: {
          grossRaised: { increment: donation.grossAmount },
          netRaised: { increment: donation.netAmount },
          donationsCount: { increment: 1 },
        },
      });

      return d;
    });

    await this.audit.log({
      action: 'DONATION_PAID',
      entityType: 'Donation',
      entityId: donationId,
      metadata: { amount: donation.grossAmount, net: donation.netAmount },
    });

    return updated;
  }

  async findAllAdmin(params: {
    page?: number;
    limit?: number;
    campaignId?: string;
    status?: DonationStatus;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.campaignId) where.campaignId = params.campaignId;
    if (params.status) where.status = params.status;

    const [items, total] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          campaign: { select: { id: true, title: true, slug: true } },
          donor: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.donation.count({ where }),
    ]);

    return { items, meta: { total, page, limit } };
  }
}
