import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Share2, MessageCircle, Facebook, Copy, Heart } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

// Mock - en producción fetch a la API
async function getCampaign(slug: string) {
  const mock = {
    id: '1',
    slug: 'operacion-de-mi-hijo',
    title: 'Ayuda para la operación de mi hijo',
    description: 'Mi hijo de 8 años necesita una cirugía de corazón urgente. Los médicos nos dieron un plazo corto y el costo supera nuestras posibilidades.',
    story: `Hace tres meses descubrimos que nuestro hijo tiene una cardiopatía congénita que requiere intervención quirúrgica.

Hemos recorrido todos los canales posibles del sistema de salud, pero los tiempos de espera son muy largos y el estado de salud de nuestro hijo no puede esperar.

El presupuesto de la clínica privada es de $500.000 e incluye la cirugía, internación y los primeros controles postoperatorios.

Cualquier aporte, por más pequeño que sea, nos acerca a esa meta. Gracias de corazón a todos los que puedan ayudarnos.`,
    raised: 204000,
    goalAmount: 500000,
    donationsCount: 87,
    category: 'Salud',
    mainImageUrl: null,
    media: [],
    beneficiary: {
      fullName: 'María González',
      city: 'Córdoba',
      province: 'Córdoba',
      avatarUrl: null,
    },
    donations: [
      { id: '1', donorName: 'Anónimo', message: 'Fuerza!', netAmount: 5000, paidAt: '2026-11-05' },
      { id: '2', donorName: 'Laura M.', message: 'Que se recupere pronto', netAmount: 10000, paidAt: '2026-11-04' },
    ],
  };

  if (slug !== mock.slug && slug !== 'operacion-de-mi-hijo') {
    return null;
  }
  return mock;
}

export default async function CampaignPage({ params }: { params: { slug: string } }) {
  const campaign = await getCampaign(params.slug);
  if (!campaign) notFound();

  const progress = Math.min(100, (campaign.raised / campaign.goalAmount) * 100);
  const shareUrl = `https://ayudasolidaria.com.ar/campanas/${campaign.slug}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-2xl border bg-muted aspect-video">
            {campaign.mainImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={campaign.mainImageUrl} alt={campaign.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <Heart className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {campaign.category}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              {campaign.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {campaign.beneficiary.city}, {campaign.beneficiary.province}
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold">Historia</h2>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {campaign.story}
            </p>
          </div>

          {/* Donaciones recientes */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Donaciones recientes</h2>
            <div className="space-y-3">
              {campaign.donations.map((d) => (
                <div key={d.id} className="flex items-start justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">{d.donorName || 'Anónimo'}</p>
                    {d.message && (
                      <p className="mt-1 text-sm text-muted-foreground">"{d.message}"</p>
                    )}
                  </div>
                  <span className="font-semibold text-primary">{formatMoney(d.netAmount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar donación */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div>
              <p className="text-3xl font-bold text-primary">{formatMoney(campaign.raised)}</p>
              <p className="text-sm text-muted-foreground">
                recaudados de {formatMoney(campaign.goalAmount)}
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="progress-bar h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {campaign.donationsCount} personas ya donaron
            </p>

            <Link
              href={`/campanas/${campaign.slug}/donar`}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Donar ahora
            </Link>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Ayudá a esta causa: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm hover:bg-accent"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm hover:bg-accent"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </a>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm hover:bg-accent"
              onClick={() => {
                if (typeof navigator !== 'undefined') {
                  navigator.clipboard.writeText(shareUrl);
                }
              }}
            >
              <Copy className="h-4 w-4" />
              Copiar enlace
            </button>

            <div className="rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Transparencia</p>
              <p className="mt-1">
                El monto mostrado es el neto destinado a la causa (después de comisiones de
                plataforma y procesador de pagos).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
