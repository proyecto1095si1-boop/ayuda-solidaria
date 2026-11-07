'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState(12);
  const [processorFee, setProcessorFee] = useState(6.4);
  const [minDonation, setMinDonation] = useState(500);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalFee = platformFee + processorFee;
  const exampleGross = 25000;
  const exampleNet = exampleGross * (1 - totalFee / 100);

  const handleSave = async () => {
    setLoading(true);
    try {
      // await api.patch('/settings', { platformFeePercent: platformFee, processorFeePercent: processorFee, minDonationAmount: minDonation });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
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
            <Link href="/admin/transferencias" className="text-muted-foreground hover:text-foreground">Transferencias</Link>
            <Link href="/admin/configuracion" className="font-medium">Configuración</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Configuración de comisiones</h1>
        <p className="mb-8 text-muted-foreground">
          Estos porcentajes se aplican a todas las donaciones nuevas.
        </p>

        <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Comisión de plataforma (%)
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={50}
              value={platformFee}
              onChange={(e) => setPlatformFee(Number(e.target.value))}
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">Valor por defecto: 12%</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Comisión de pasarela / procesador (%)
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={20}
              value={processorFee}
              onChange={(e) => setProcessorFee(Number(e.target.value))}
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">Valor por defecto: 6.4% (Mercado Pago aprox.)</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Monto mínimo de donación (ARS)
            </label>
            <input
              type="number"
              min={100}
              value={minDonation}
              onChange={(e) => setMinDonation(Number(e.target.value))}
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-sm font-medium">Vista previa</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Total descontado: <strong>{totalFee.toFixed(1)}%</strong>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ejemplo: donación de $25.000 → neto a la causa:{' '}
              <strong className="text-primary">
                ${exampleNet.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </strong>
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
