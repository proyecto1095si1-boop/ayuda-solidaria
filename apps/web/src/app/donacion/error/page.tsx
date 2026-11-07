import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function DonationErrorPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold">No se pudo completar el pago</h1>
      <p className="mt-3 text-muted-foreground">
        Algo salió mal con el pago. No se te cobró nada. Podés intentar de nuevo.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/campanas"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Volver a campañas
        </Link>
        <Link href="/" className="rounded-xl border px-5 py-2.5 text-sm hover:bg-accent">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
