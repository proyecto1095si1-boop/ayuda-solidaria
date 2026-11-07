'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  Pause,
  Star,
  Eye,
  Search,
} from 'lucide-react';
import { formatMoney } from '@/lib/utils';

type Status = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'FINISHED';

const MOCK = [
  {
    id: 'c1',
    title: 'Ayuda para la operación de mi hijo',
    status: 'APPROVED' as Status,
    netRaised: 204000,
    goalAmount: 500000,
    donationsCount: 87,
    isFeatured: true,
    beneficiary: {
      fullName: 'María González',
      email: 'maria@email.com',
      dni: '30123456',
      cbu: '0170099120000012345678',
      alias: 'maria.gonzalez.mp',
      phone: '351-1234567',
    },
    createdAt: '2026-10-15',
  },
  {
    id: 'c2',
    title: 'Reconstruir mi casa después del incendio',
    status: 'PENDING' as Status,
    netRaised: 0,
    goalAmount: 800000,
    donationsCount: 0,
    isFeatured: false,
    beneficiary: {
      fullName: 'Carlos Ruiz',
      email: 'carlos@email.com',
      dni: '28456789',
      cbu: '0070001230000098765432',
      alias: 'carlos.ruiz',
      phone: '341-9876543',
    },
    createdAt: '2026-11-04',
  },
  {
    id: 'c3',
    title: 'Tratamiento oncológico de mi mamá',
    status: 'UNDER_REVIEW' as Status,
    netRaised: 0,
    goalAmount: 350000,
    donationsCount: 0,
    isFeatured: false,
    beneficiary: {
      fullName: 'Ana López',
      email: 'ana@email.com',
      dni: '25987654',
      cbu: '0110001230000011223344',
      alias: 'ana.lopez',
      phone: '261-5551234',
    },
    createdAt: '2026-11-06',
  },
];

const STATUS_LABEL: Record<Status, string> = {
  PENDING: 'Pendiente',
  UNDER_REVIEW: 'En revisión',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  SUSPENDED: 'Suspendida',
  FINISHED: 'Finalizada',
};

const STATUS_COLOR: Record<Status, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  SUSPENDED: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  FINISHED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL');
  const [selected, setSelected] = useState<typeof MOCK[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered =
    filter === 'ALL' ? MOCK : MOCK.filter((c) => c.status === filter);

  const handleAction = (id: string, action: string) => {
    // api.patch(`/admin/campaigns/${id}/status`, { status: action, rejectionReason })
    alert(`Acción: ${action} en campaña ${id}`);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center gap-6 px-4">
          <Link href="/admin" className="font-bold text-primary">Ayuda Solidaria</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/admin/campanas" className="font-medium">Campañas</Link>
            <Link href="/admin/donaciones" className="text-muted-foreground hover:text-foreground">Donaciones</Link>
            <Link href="/admin/transferencias" className="text-muted-foreground hover:text-foreground">Transferencias</Link>
            <Link href="/admin/configuracion" className="text-muted-foreground hover:text-foreground">Configuración</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Administrar campañas</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar..."
              className="rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'FINISHED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              }`}
            >
              {s === 'ALL' ? 'Todas' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Campaña</th>
                <th className="px-4 py-3 text-left font-medium">Beneficiario</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Recaudado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.isFeatured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                      <span className="font-medium">{c.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{c.beneficiary.fullName}</p>
                    <p className="text-xs text-muted-foreground">{c.beneficiary.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[c.status]}`}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-medium">{formatMoney(c.netRaised)}</p>
                    <p className="text-xs text-muted-foreground">de {formatMoney(c.goalAmount)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setSelected(c)}
                        className="rounded-md p-1.5 hover:bg-accent"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(c.status === 'PENDING' || c.status === 'UNDER_REVIEW') && (
                        <>
                          <button
                            onClick={() => handleAction(c.id, 'APPROVED')}
                            className="rounded-md p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            title="Aprobar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelected(c)}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            title="Rechazar"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {c.status === 'APPROVED' && (
                        <button
                          onClick={() => handleAction(c.id, 'SUSPENDED')}
                          className="rounded-md p-1.5 text-orange-600 hover:bg-orange-50"
                          title="Suspender"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal detalle */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl">
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Estado: {STATUS_LABEL[selected.status]}
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <h3 className="font-semibold">Beneficiario</h3>
                <div className="rounded-xl bg-muted/50 p-4 space-y-1">
                  <p><span className="text-muted-foreground">Nombre:</span> {selected.beneficiary.fullName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selected.beneficiary.email}</p>
                  <p><span className="text-muted-foreground">DNI:</span> {selected.beneficiary.dni}</p>
                  <p><span className="text-muted-foreground">Tel:</span> {selected.beneficiary.phone}</p>
                  <p><span className="text-muted-foreground">CBU:</span> <code className="text-xs">{selected.beneficiary.cbu}</code></p>
                  <p><span className="text-muted-foreground">Alias:</span> {selected.beneficiary.alias}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-muted-foreground">Objetivo</p>
                    <p className="font-medium">{formatMoney(selected.goalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recaudado neto</p>
                    <p className="font-medium text-primary">{formatMoney(selected.netRaised)}</p>
                  </div>
                </div>
              </div>

              {(selected.status === 'PENDING' || selected.status === 'UNDER_REVIEW') && (
                <div className="mt-6 space-y-3">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Motivo de rechazo (si aplica)"
                    rows={2}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(selected.id, 'APPROVED')}
                      className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, 'REJECTED')}
                      className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-4 w-full rounded-xl border py-2.5 text-sm hover:bg-accent"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
