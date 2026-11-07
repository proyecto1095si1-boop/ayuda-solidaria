import Link from 'next/link';
import { MapPin, Users } from 'lucide-react';

interface CampaignCardProps {
  campaign: {
    id: string;
    slug: string;
    title: string;
    description: string;
    raised: number;
    goalAmount: number;
    donationsCount: number;
    category: string;
    mainImageUrl?: string | null;
    beneficiary?: {
      fullName: string;
      city?: string;
      province?: string;
    };
    isFeatured?: boolean;
  };
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = Math.min(100, (campaign.raised / campaign.goalAmount) * 100);

  return (
    <Link
      href={`/campanas/${campaign.slug}`}
      className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-muted">
        {campaign.mainImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.mainImageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl font-bold text-primary/30">
              {campaign.title.charAt(0)}
            </span>
          </div>
        )}
        {campaign.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            Destacada
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
          {campaign.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
          {campaign.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {campaign.description}
        </p>

        {campaign.beneficiary && (
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {campaign.beneficiary.city}
              {campaign.beneficiary.province ? `, ${campaign.beneficiary.province}` : ''}
            </span>
          </div>
        )}

        <div className="mt-4">
          <div className="mb-1.5 flex items-end justify-between text-sm">
            <span className="font-semibold text-primary">
              {formatMoney(campaign.raised)}
            </span>
            <span className="text-muted-foreground">
              de {formatMoney(campaign.goalAmount)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="progress-bar h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {campaign.donationsCount} donaciones
          </div>
        </div>
      </div>
    </Link>
  );
}
