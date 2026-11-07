'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Heart,
  Users,
  DollarSign,
  FileText,
  Settings,
  ArrowUpRight,
} from 'lucide-react';
import { formatMoney } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRaised: 12400000,
    totalPlatformFees: 1488000,
    totalTransferred: 9800000,
    active: 42,
    pending: 8,
    finished: 156,
    users: 3200,
    donors: 2800,
  });

  // useEffect(() => { api.get('/admin/dashboard').then(r => setStats(r.data)) }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-primary">
              Ayuda Solidaria
            </Link>
            <nav className="hidden gap-4 text-sm md:flex">
              <Link href="/admin" className="font-medium">Dashboard</Link>
              <Link href="/admin/campanas" className="text-muted-foreground hover:text-foreground">Campañas</Link>
              <Link href="/admin/donaciones" className="text-muted-foreground hover:text-foreground">Donaciones</Link>
              <Link href="/admin/transferencias" className="text-muted-foreground hover:text-foreground">Transferencias</Link>
              <Link href="/admin/configuracion" className="text-muted-foreground hover:text-foreground">Configuración</Link>
            </nav>
          </div>
          <span className="text-sm text-muted-foreground">Admin</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total recaudado</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{formatMoney(stats.totalRaised)}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Comisiones plataforma</p>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{formatMoney(stats.totalPlatformFees)}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Transferido</p>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{formatMoney(stats.totalTransferred)}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Usuarios</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{stats.users.toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Campañas activas</p>
            <p className="mt-1 text-3xl font-bold text-primary">{stats.active}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Pendientes de revisión</p>
            <p className="mt-1 text-3xl font-bold text-amber-500">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Finalizadas</p>
            <p className="mt-1 text-3xl font-bold">{stats.finished}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-semibold">Acciones rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/campanas?status=PENDING"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Revisar campañas pendientes ({stats.pending})
            </Link>
            <Link
              href="/admin/donaciones"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Ver donaciones
            </Link>
            <Link
              href="/admin/configuracion"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Configurar comisiones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
