'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Download } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

const MOCK_TRANSFERS = [
  {
    id: 't1',
    campaign: 'Ayuda para la operación de mi hijo',
    beneficiary: 'María González',
    cbu: '0170099120000012345678',
    alias: 'maria.gonzalez.mp',
    amount: 150000,
    operationNumber: 'TRX-20261101-001',
    status: 'COMPLETED',
    transferredAt: '2026-11-01T16:00:00',
    receiptUrl: null,
  },
];

export default function AdminTransfersPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    campaignId: '',
    amount: '',
    operationNumber: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // api.post('/transfers', form)
    alert('Transferencia registrada');
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center gap-6 px-4">
          <Link href="/admin" className="font-bold text-primary">Ayuda Solidaria</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/admin/campanas" className="text-muted-foreground hover:text-foreground">Campañas</Link>
            <Link href="/admin/donaciones" className="text-muted-foreground hover:text-foreground">Donaciones</Link>
            <Link href="/admin/transferencias" className="font-medium">Transferencias</Link>
            <Link href="/admin/configuracion" className="text-muted-foreground hover:text-foreground">Configuración</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Transferencias a beneficiarios</h1>
          <div className="flex gap-2">
            <button
              onClick={() => alert('Exportar reporte')}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Nueva transferencia
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Campaña</th>
                <th className="px-4 py-3 text-left font-medium">Beneficiario</th>
                <th className="px-4 py-3 text-left font-medium">CBU / Alias</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
                <th className="px-4 py-3 text-left font-medium">N° operación</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSFERS.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(t.transferredAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3 max-w-[160px] truncate">{t.campaign}</td>
                  <td className="px-4 py-3">{t.beneficiary}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{t.cbu}</p>
                    <p className="text-xs text-muted-foreground">{t.alias}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-primary">
                    {formatMoney(t.amount)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{t.operationNumber}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
                      Completada
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold">Registrar transferencia</h2>

              <div>
                <label className="mb-1.5 block text-sm font-medium">ID de campaña</label>
                <input
                  required
                  value={form.campaignId}
                  onChange={(e) => setForm({ ...form, campaignId: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Monto (ARS)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">N° de operación</label>
                <input
                  value={form.operationNumber}
                  onChange={(e) => setForm({ ...form, operationNumber: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Comprobante (PDF/imagen)</label>
                <input type="file" accept=".pdf,image/*" className="text-sm" />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border py-2.5 text-sm hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
