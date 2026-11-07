import Link from 'next/link';
import { Search } from 'lucide-react';
import { CampaignCard } from '@/components/campaigns/campaign-card';

const CATEGORIES = ['Todas', 'Salud', 'Educación', 'Vivienda', 'Emergencias', 'Animales', 'Comunidad', 'Otros'];

const MOCK_CAMPAIGNS = [
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
  {
    id: '3',
    slug: 'tratamiento-oncologico',
    title: 'Tratamiento oncológico de mi mamá',
    description: 'Necesitamos cubrir quimioterapias y medicamentos que no cubre la obra social.',
    raised: 89000,
    goalAmount: 350000,
    donationsCount: 31,
    category: 'Salud',
    mainImageUrl: null,
    beneficiary: { fullName: 'Ana López', city: 'Mendoza', province: 'Mendoza' },
    isFeatured: false,
  },
  {
    id: '4',
    slug: 'becas-escolares',
    title: 'Becas escolares para 20 niños',
    description: 'Útiles, uniformes y cuotas para que no abandonen la escuela.',
    raised: 45000,
    goalAmount: 200000,
    donationsCount: 18,
    category: 'Educación',
    mainImageUrl: null,
    beneficiary: { fullName: 'Fundación Esperanza', city: 'La Plata', province: 'Buenos Aires' },
    isFeatured: false,
  },
];

export default function CampaignsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Campañas</h1>
        <p className="mt-2 text-muted-foreground">
          Encontrá causas reales y ayudá de forma segura.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar campañas..."
            className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                cat === 'Todas'
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CAMPAIGNS.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">¿No encontrás lo que buscás?</p>
        <Link
          href="/crear-campana"
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          Creá tu propia campaña →
        </Link>
      </div>
    </div>
  );
}
