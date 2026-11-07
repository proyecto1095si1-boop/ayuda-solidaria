'use client';

import Link from 'next/link';
import { Download, Search } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

const MOCK_DONATIONS = [
  {
    id: 'd1',
    campaign: 'Ayuda para la operación de mi hijo',
    donorName: 'Laura M.',
    donorEmail: 'laura@email.com',
    grossAmount: 25000,
    platformFee: 3000,
    processorFee: 1600,
    netAmount: 20400,
    status: 'APPROVED',
    paidAt: '2026-11-05T14:30:00',
  },
  {
    id: 'd2',
    campaign: 'Ayuda para la operación de mi hijo',
    donorName: 'Anónimo',
    donorEmail: null,
    grossAmount: 5000,
    platformFee: 600,
    processorFee: 320,
    netAmount: 4080,
    status: 'APPROVED',
    paidAt: '2026-11-04T09:15:00',
  },
  {
    id: 'd3',
    campaign: 'Reconstruir mi casa después del incendio',
    donorName: 'Pedro S.',
    donorEmail: 'pedro@email.com',
    grossAmount: 10000,
    platformFee: 1200,
    processorFee: 640,
    netAmount: 8160,
    status: 'PENDING',
    paidAt: null,
  },
];

export default function AdminDonationsPage() {
  const handleExport = (format: 'csv' | 'excel') => {
    // window.open(`/api/admin/exports/donations?format=${format}`)
    alert(`Exportar donaciones en ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center gap-6 px-4">
          <Link href="/admin" className="font-bold text-primary">Ayuda Solidaria</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/admin/campanas" className="text-muted-foreground hover:text-foreground">Campañas</Link>
            <Link href="/admin/donaciones" className="font-medium">Donaciones</Link>
            <Link href="/admin/transferencias" className="text-muted-foreground hover:text-foreground">Transferencias</Link>
            <Link href="/admin/configuracion" className="text-muted-foreground hover:text-foreground">Configuración</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Donaciones</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              Excel
            </button>
          </div>
        </div>

        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por donante o campaña..."
            className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Campaña</th>
                <th className="px-4 py-3 text-left font-medium">Donante</th>
                <th className="px-4 py-3 text-right font-medium">Bruto</th>
                <th className="px-4 py-3 text-right font-medium">Com. plataforma</th>
                <th className="px-4 py-3 text-right font-medium">Com. procesador</th>
                <th className="px-4 py-3 text-right font-medium">Neto</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DONATIONS.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {d.paidAt
                      ? new Date(d.paidAt).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 max-w-[180px] truncate">{d.campaign}</td>
                  <td className="px-4 py-3">
                    <p>{d.donorName}</p>
                    {d.donorEmail && (
                      <p className="text-xs text-muted-foreground">{d.donorEmail}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{formatMoney(d.grossAmount)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatMoney(d.platformFee)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatMoney(d.processorFee)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-primary">
                    {formatMoney(d.netAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        d.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {d.status === 'APPROVED' ? 'Aprobada' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Ejemplo: donación de $25.000 → plataforma 12% ($3.000) + procesador 6.4% ($1.600) = neto $20.400
        </p>
      </div>
    </div>
  );
}
