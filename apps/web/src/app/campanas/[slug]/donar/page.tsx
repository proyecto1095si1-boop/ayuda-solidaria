'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 50000];

export default function DonatePage() {
  const params = useParams();
  const router = useRouter();
  const [amount, setAmount] = useState<number | ''>('');
  const [custom, setCustom] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!amount || amount < 500) return;
    setLoading(true);
    try {
      // Llamada real a la API:
      // const res = await api.post('/donations', { campaignId, amount, donorName: name, donorEmail: email, message });
      // if (res.data.checkoutUrl) window.location.href = res.data.checkoutUrl;
      alert(`Donación de ${formatMoney(Number(amount))} iniciada. (Integrar Mercado Pago)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <Link
        href={`/campanas/${params.slug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la campaña
      </Link>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Hacer una donación</h1>
            <p className="text-sm text-muted-foreground">Seguro con Mercado Pago</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Monto</label>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAmount(a);
                  setCustom(false);
                }}
                className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
                  amount === a && !custom
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                {formatMoney(a)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setCustom(true);
                setAmount('');
              }}
              className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
                custom ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              Otro
            </button>
          </div>

          {custom && (
            <div className="mt-3">
              <input
                type="number"
                min={500}
                placeholder="Ingresá el monto"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-lg border bg-background px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nombre (opcional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre o Anónimo"
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email (opcional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="para enviarte el comprobante"
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mensaje (opcional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Un mensaje de apoyo..."
              className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={handleDonate}
          disabled={!amount || amount < 500 || loading}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : `Donar ${amount ? formatMoney(Number(amount)) : ''}`}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Al donar aceptás los términos. El monto neto llega a la causa después de las
          comisiones de plataforma y Mercado Pago.
        </p>
      </div>
    </div>
  );
}
