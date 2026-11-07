import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function DonationSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold">¡Gracias por tu donación!</h1>
      <p className="mt-3 text-muted-foreground">
        Tu aporte ya está en camino a la causa. Vas a recibir la confirmación de Mercado Pago
        por email.
      </p>
      {searchParams.id && (
        <p className="mt-2 text-xs text-muted-foreground">
          ID de donación: {searchParams.id}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <Link
          href="/campanas"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ver más campañas
        </Link>
        <Link
          href="/"
          className="rounded-xl border px-5 py-2.5 text-sm hover:bg-accent"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
