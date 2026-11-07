import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CampaignStatus, DonationStatus } from '@prisma/client';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);
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

    if (!this.mpClient) {
      this.logger.warn('Mercado Pago no configurado — donación en PENDING');
      return {
        donation: {
          id: donation.id,
          netAmount: net,
          grossAmount: gross,
        },
        checkoutUrl: null,
        message: 'Mercado Pago no configurado. Donación creada en estado PENDING.',
      };
    }

    const preference = new Preference(this.mpClient);
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const apiUrl = this.config.get<string>('API_URL', 'http://localhost:3001');

    const pref = await preference.create({
      body: {
        items: [
          {
            id: donation.id,
            title: `Donación - ${campaign.title}`.
              slice(0, 100),
            quantity: 1,
            unit_price: Number(gross),
            currency_id: 'ARS',
          },
        ],
        external_reference: donation.id,
        notification_url: `${apiUrl}/api/donations/webhook`,
        back_urls: {
          success: `${frontendUrl}/donacion/exito?id=${donation.id}`,
          failure: `${frontendUrl}/donacion/error?id=${donation.id}`,
          pending: `${frontendUrl}/donacion/pendiente?id=${donation.id}`,
        },
        auto_return: 'approved',
        statement_descriptor: 'AYUDA SOLIDARIA',
      },
    });

    await this.prisma.donation.update({
      where: { id: donation.id },
      data: { mercadopagoId: pref.id },
    });

    return {
      donation: { id: donation.id, netAmount: net, grossAmount: gross },
      checkoutUrl: pref.init_point,
      sandboxUrl: pref.sandbox_init_point,
      preferenceId: pref.id,
    };
  }

  /**
   * Webhook de Mercado Pago.
   * Tipos relevantes: payment
   */
  async handleWebhook(body: any, query?: any) {
    this.logger.log(`Webhook recibido: ${JSON.stringify({ body, query })}`);

    // MP puede enviar topic/id por query o por body
    const topic = query?.topic || query?.type || body?.type || body?.action;
    const paymentId =
      query?.id ||
      query?.['data.id'] ||
      body?.data?.id ||
      body?.id;

    if (!paymentId) {
      return { received: true, processed: false, reason: 'no payment id' };
    }

    // Solo nos interesan notificaciones de payment
    if (topic && !String(topic).includes('payment')) {
      return { received: true, processed: false, reason: `ignored topic: ${topic}` };
    }

    if (!this.mpClient) {
      this.logger.warn('MP no configurado, no se puede consultar el pago');
      return { received: true, processed: false, reason: 'mp not configured' };
    }

    try {
      const paymentApi = new Payment(this.mpClient);
      const payment = await paymentApi.get({ id: paymentId });

      const externalRef = payment.external_reference;
      if (!externalRef) {
        return { received: true, processed: false, reason: 'no external_reference' };
      }

      const status = payment.status; // approved | pending | rejected | cancelled | refunded

      if (status === 'approved') {
        await this.markAsPaid(externalRef, {
          paymentId: payment.id,
          status: payment.status,
          statusDetail: payment.status_detail,
          transactionAmount: payment.transaction_amount,
          dateApproved: payment.date_approved,
          paymentMethodId: payment.payment_method_id,
        });
        return { received: true, processed: true, status: 'approved' };
      }

      if (status === 'rejected' || status === 'cancelled') {
        await this.prisma.donation.updateMany({
          where: {
            id: externalRef,
            status: DonationStatus.PENDING,
          },
          data: {
            status: DonationStatus.REJECTED,
            mercadopagoData: payment as any,
          },
        });
        return { received: true, processed: true, status };
      }

      return { received: true, processed: false, status };
    } catch (err: any) {
      this.logger.error(`Error procesando webhook: ${err.message}`, err.stack);
      return { received: true, processed: false, error: err.message };
    }
  }

  async markAsPaid(donationId: string, mpData?: any) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { campaign: true },
    });

    if (!donation) {
      this.logger.warn(`Donación ${donationId} no encontrada`);
      return null;
    }

    if (donation.status === DonationStatus.APPROVED) {
      return donation; // idempotente
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
      metadata: {
        amount: Number(donation.grossAmount),
        net: Number(donation.netAmount),
        campaignId: donation.campaignId,
      },
    });

    this.logger.log(`Donación ${donationId} marcada como pagada. Neto: ${donation.netAmount}`);
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

  async findOne(id: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: {
        campaign: { select: { id: true, title: true, slug: true } },
      },
    });
    if (!donation) throw new NotFoundException('Donación no encontrada');
    return donation;
  }
}
