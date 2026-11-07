'use client';

import Link from 'next/link';
import { Plus, Heart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

const MOCK_MY_CAMPAIGNS = [
  {
    id: '1',
    title: 'Ayuda para la operación de mi hijo',
    status: 'APPROVED',
    raised: 204000,
    goalAmount: 500000,
    donationsCount: 87,
    createdAt: '2026-10-15',
  },
  {
    id: '2',
    title: 'Tratamiento de seguimiento',
    status: 'PENDING',
    raised: 0,
    goalAmount: 150000,
    donationsCount: 0,
    createdAt: '2026-11-05',
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pendiente', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950', icon: Clock },
  UNDER_REVIEW: { label: 'En revisión', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950', icon: Clock },
  APPROVED: { label: 'Aprobada', color: 'text-green-600 bg-green-50 dark:bg-green-950', icon: CheckCircle },
  REJECTED: { label: 'Rechazada', color: 'text-red-600 bg-red-50 dark:bg-red-950', icon: XCircle },
  SUSPENDED: { label: 'Suspendida', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950', icon: XCircle },
  FINISHED: { label: 'Finalizada', color: 'text-gray-600 bg-gray-50 dark:bg-gray-900', icon: CheckCircle },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi panel</h1>
          <p className="text-muted-foreground">Gestioná tus campañas y donaciones</p>
        </div>
        <Link
          href="/crear-campana"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva campaña
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Campañas activas</p>
          <p className="mt-1 text-3xl font-bold">1</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total recaudado (neto)</p>
          <p className="mt-1 text-3xl font-bold text-primary">{formatMoney(204000)}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Donaciones recibidas</p>
          <p className="mt-1 text-3xl font-bold">87</p>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Mis campañas</h2>
      <div className="space-y-4">
        {MOCK_MY_CAMPAIGNS.map((c) => {
          const st = STATUS_MAP[c.status] || STATUS_MAP.PENDING;
          const Icon = st.icon;
          const progress = c.goalAmount > 0 ? (c.raised / c.goalAmount) * 100 : 0;

          return (
            <div key={c.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{c.title}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                      <Icon className="h-3 w-3" />
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Creada el {new Date(c.createdAt).toLocaleDateString('es-AR')}
                  </p>

                  {c.status === 'APPROVED' && (
                    <div className="mt-3 max-w-md">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-primary">{formatMoney(c.raised)}</span>
                        <span className="text-muted-foreground">de {formatMoney(c.goalAmount)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{c.donationsCount} donaciones</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {c.status === 'APPROVED' && (
                    <Link
                      href={`/campanas/operacion-de-mi-hijo`}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-accent"
                    >
                      Ver pública
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/campanas/${c.id}`}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Gestionar
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {MOCK_MY_CAMPAIGNS.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-medium">Todavía no tenés campañas</p>
          <Link href="/crear-campana" className="mt-2 inline-block text-sm text-primary hover:underline">
            Creá tu primera campaña →
          </Link>
        </div>
      )}
    </div>
  );
}
