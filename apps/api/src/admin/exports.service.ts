import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { DonationStatus } from '@prisma/client';

@Injectable()
export class ExportsService {
  constructor(private prisma: PrismaService) {}

  async exportDonationsCsv(): Promise<string> {
    const donations = await this.prisma.donation.findMany({
      where: { status: DonationStatus.APPROVED },
      orderBy: { paidAt: 'desc' },
      include: {
        campaign: {
          select: {
            title: true,
            beneficiary: {
              select: {
                fullName: true,
                cbu: true,
                alias: true,
              },
            },
          },
        },
        donor: { select: { fullName: true, email: true } },
      },
    });

    const header = [
      'Fecha',
      'Campaña',
      'Beneficiario',
      'CBU',
      'Alias',
      'Donante',
      'Email donante',
      'Donación bruta',
      'Comisión plataforma',
      'Comisión procesador',
      'Monto neto',
      'Estado',
    ].join(',');

    const rows = donations.map((d) =>
      [
        d.paidAt?.toISOString() || '',
        `"${d.campaign.title.replace(/"/g, '""')}"`,
        `"${d.campaign.beneficiary.fullName.replace(/"/g, '""')}"`,
        d.campaign.beneficiary.cbu || '',
        d.campaign.beneficiary.alias || '',
        `"${(d.donorName || d.donor?.fullName || 'Anónimo').replace(/"/g, '""')}"`,
        d.donorEmail || d.donor?.email || '',
        Number(d.grossAmount),
        Number(d.platformFee),
        Number(d.processorFee),
        Number(d.netAmount),
        d.status,
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }

  async exportDonationsExcel(): Promise<Buffer> {
    const donations = await this.prisma.donation.findMany({
      where: { status: DonationStatus.APPROVED },
      orderBy: { paidAt: 'desc' },
      include: {
        campaign: {
          select: {
            title: true,
            beneficiary: {
              select: { fullName: true, cbu: true, alias: true },
            },
          },
        },
        donor: { select: { fullName: true, email: true } },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Donaciones');

    sheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Campaña', key: 'campana', width: 40 },
      { header: 'Beneficiario', key: 'beneficiario', width: 25 },
      { header: 'CBU', key: 'cbu', width: 26 },
      { header: 'Alias', key: 'alias', width: 20 },
      { header: 'Donante', key: 'donante', width: 20 },
      { header: 'Email donante', key: 'email', width: 25 },
      { header: 'Donación bruta', key: 'bruto', width: 15 },
      { header: 'Comisión plataforma', key: 'comPlataforma', width: 18 },
      { header: 'Comisión procesador', key: 'comProcesador', width: 18 },
      { header: 'Monto neto', key: 'neto', width: 15 },
      { header: 'Estado', key: 'estado', width: 12 },
    ];

    sheet.getRow(1).font = { bold: true };

    for (const d of donations) {
      sheet.addRow({
        fecha: d.paidAt?.toISOString() || '',
        campana: d.campaign.title,
        beneficiario: d.campaign.beneficiary.fullName,
        cbu: d.campaign.beneficiary.cbu || '',
        alias: d.campaign.beneficiary.alias || '',
        donante: d.donorName || d.donor?.fullName || 'Anónimo',
        email: d.donorEmail || d.donor?.email || '',
        bruto: Number(d.grossAmount),
        comPlataforma: Number(d.platformFee),
        comProcesador: Number(d.processorFee),
        neto: Number(d.netAmount),
        estado: d.status,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportTransfersReport(): Promise<string> {
    const transfers = await this.prisma.transfer.findMany({
      orderBy: { transferredAt: 'desc' },
      include: {
        campaign: { select: { title: true } },
        beneficiary: {
          select: { fullName: true, cbu: true, alias: true },
        },
      },
    });

    const header = [
      'Fecha',
      'Campaña',
      'Beneficiario',
      'CBU',
      'Alias',
      'Monto',
      'N° operación',
      'Estado',
      'Comprobante',
    ].join(',');

    const rows = transfers.map((t) =>
      [
        t.transferredAt?.toISOString() || t.createdAt.toISOString(),
        `"${t.campaign.title.replace(/"/g, '""')}"`,
        `"${t.beneficiary.fullName.replace(/"/g, '""')}"`,
        t.beneficiary.cbu || '',
        t.beneficiary.alias || '',
        Number(t.amount),
        t.operationNumber || '',
        t.status,
        t.receiptUrl || '',
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }
}
