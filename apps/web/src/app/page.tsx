import Link from 'next/link';
import { Heart, Shield, Users, ArrowRight, Search } from 'lucide-react';
import { CampaignCard } from '@/components/campaigns/campaign-card';

// En producción esto vendría de la API
const featuredCampaigns = [
  {
    id: '1',
    slug: 'operacion-de-mi-hijo',
    title: 'Ayuda para la operación de mi hijo',
    description: 'Mi hijo necesita una cirugía urgente. Cualquier aporte suma.',
    raised: 204000,
    goalAmount: 500000,
    donationsCount: 87,
    category: 'Salud',
    mainImageUrl: null,
    beneficiary: { fullName: 'María González', city: 'Córdoba', province: 'Córdoba' },
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'reconstruir-mi-casa',
    title: 'Reconstruir mi casa después del incendio',
    description: 'Perdimos todo en un incendio. Necesitamos ayuda para empezar de nuevo.',
    raised: 156000,
    goalAmount: 800000,
    donationsCount: 42,
    category: 'Vivienda',
    mainImageUrl: null,
    beneficiary: { fullName: 'Carlos Ruiz', city: 'Rosario', province: 'Santa Fe' },
    isFeatured: true,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Ayudá a quienes más lo{' '}
              <span className="text-primary">necesitan</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Plataforma de crowdfunding solidario en Argentina. Creá una campaña o doná
              de forma segura. Transparencia total en cada peso.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/campanas"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Ver campañas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/crear-campana"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
              >
                Crear campaña
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">$12.4M</p>
            <p className="text-sm text-muted-foreground">Recaudados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">1.2k</p>
            <p className="text-sm text-muted-foreground">Campañas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">8.5k</p>
            <p className="text-sm text-muted-foreground">Donantes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">98%</p>
            <p className="text-sm text-muted-foreground">Llegan a la causa*</p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">Cómo funciona</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">1. Creá tu campaña</h3>
            <p className="text-sm text-muted-foreground">
              Contá tu historia, subí fotos y documentación. Nuestro equipo la revisa.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">2. Recibí donaciones</h3>
            <p className="text-sm text-muted-foreground">
              Compartí el enlace. Las personas donan de forma segura con Mercado Pago.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">3. Recibí los fondos</h3>
            <p className="text-sm text-muted-foreground">
              Transferimos el dinero a tu CBU una vez verificada la documentación.
            </p>
          </div>
        </div>
      </section>

      {/* Campañas destacadas */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Campañas destacadas</h2>
            <Link
              href="/campanas"
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              Ver todas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿Necesitás ayuda o querés ayudar?
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Miles de personas ya confiaron en Ayuda Solidaria. Unite a la comunidad.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/registro"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-medium text-primary shadow transition-colors hover:bg-white/90"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/campanas"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Explorar campañas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
