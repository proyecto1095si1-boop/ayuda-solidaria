'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';

const CATEGORIES = [
  'Salud',
  'Educación',
  'Vivienda',
  'Emergencias',
  'Animales',
  'Comunidad',
  'Otros',
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: '',
    category: '',
    goalAmount: '',
    deadline: '',
    description: '',
    story: '',
    reason: '',
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.title.length >= 10 &&
    form.category &&
    Number(form.goalAmount) >= 1000 &&
    form.description.length >= 20 &&
    form.story.length >= 50 &&
    form.reason.length >= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      // const res = await api.post('/campaigns', {
      //   ...form,
      //   goalAmount: Number(form.goalAmount),
      //   mediaUrls,
      // });
      // router.push(`/dashboard/campanas/${res.data.id}`);
      router.push('/dashboard?created=1');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al crear la campaña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>

      <h1 className="mb-2 text-3xl font-bold">Crear campaña</h1>
      <p className="mb-8 text-muted-foreground">
        Contá tu historia con claridad. Nuestro equipo la revisará antes de publicarla.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium">Título de la campaña *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            maxLength={120}
            placeholder="Ej: Ayuda para la operación de mi hijo"
            className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">{form.title.length}/120</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Categoría *</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Seleccionar</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Monto objetivo (ARS) *</label>
            <input
              type="number"
              min={1000}
              value={form.goalAmount}
              onChange={(e) => update('goalAmount', e.target.value)}
              placeholder="500000"
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Fecha límite (opcional)</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => update('deadline', e.target.value)}
            className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Descripción corta *</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={2}
            placeholder="Resumen que aparece en las tarjetas (mín. 20 caracteres)"
            className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Historia completa *</label>
          <textarea
            value={form.story}
            onChange={(e) => update('story', e.target.value)}
            rows={8}
            placeholder="Contá con detalle tu situación, qué necesitás y por qué..."
            className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Mínimo 50 caracteres ({form.story.length})
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Motivo de la ayuda *</label>
          <textarea
            value={form.reason}
            onChange={(e) => update('reason', e.target.value)}
            rows={3}
            placeholder="¿Para qué se usarán los fondos exactamente?"
            className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Fotos / Videos</label>
          <div className="rounded-xl border border-dashed p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm">Arrastrá archivos o hacé clic para subir</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, MP4 — máx. 10MB c/u</p>
            <input type="file" multiple accept="image/*,video/*" className="mt-3 text-sm" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Documentación de respaldo</label>
          <div className="rounded-xl border border-dashed p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm">Comprobantes, presupuestos, informes médicos, etc.</p>
            <input type="file" multiple accept=".pdf,image/*" className="mt-3 text-sm" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Importante</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Tu campaña quedará en estado <strong>Pendiente</strong> hasta que la revisemos.</li>
            <li>Debés tener DNI y datos bancarios completos para crear campañas.</li>
            <li>El monto que verán los donantes será el neto (después de comisiones).</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar campaña a revisión'}
        </button>
      </form>
    </div>
  );
}
