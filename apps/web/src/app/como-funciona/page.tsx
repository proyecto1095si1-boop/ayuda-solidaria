import Link from 'next/link';
import { Heart, Shield, Users, FileCheck, Banknote, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Cómo funciona',
  description: 'Cómo funciona Ayuda Solidaria: crear campañas, donar y recibir fondos con transparencia.',
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Cómo funciona</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ayuda Solidaria conecta a quienes necesitan ayuda con quienes pueden darla,
          con total transparencia en cada peso.
        </p>
      </div>

      {/* Para quienes necesitan ayuda */}
      <section className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Si necesitás ayuda</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">1. Registrate</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Creá tu cuenta como solicitante. Completá DNI, datos personales y bancarios
              (CBU/Alias). Esta información solo la ve el equipo de la plataforma.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">2. Creá tu campaña</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contá tu historia, subí fotos, videos y documentación de respaldo.
              Nuestro equipo la revisa antes de publicarla.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">3. Recibí los fondos</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Cuando haya donaciones, transferimos el monto neto a tu CBU.
              Te pedimos comprobante de cada transferencia para la auditoría.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/registro"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Crear cuenta y pedir ayuda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Para donantes */}
      <section className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Si querés donar</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">1. Elegí una causa</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Explorá las campañas aprobadas. Cada una fue verificada por nuestro equipo.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">2. Doná de forma segura</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pagás con Mercado Pago. No hace falta crear cuenta. Podés dejar un mensaje
              de apoyo.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">3. Transparencia total</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ves el monto neto que llega a la causa. Las comisiones están publicadas y
              son configurables.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/campanas"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Ver campañas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Comisiones */}
      <section className="mx-auto mt-20 max-w-2xl rounded-3xl border bg-muted/30 p-8">
        <h2 className="text-center text-xl font-bold">Sobre las comisiones</h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          De cada donación se descuentan dos comisiones (ambas configurables desde el panel):
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex justify-between border-b pb-2">
            <span>Comisión de la plataforma</span>
            <strong>12% (default)</strong>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>Comisión de Mercado Pago (aprox.)</span>
            <strong>6.4% (default)</strong>
          </li>
          <li className="flex justify-between pt-1">
            <span>Total descontado</span>
            <strong className="text-primary">18.4%</strong>
          </li>
        </ul>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ejemplo: donás <strong>$25.000</strong> → la causa recibe{' '}
          <strong className="text-primary">$20.400</strong>.
          Todas las barras de progreso muestran solo el monto neto.
        </p>
      </section>
    </div>
  );
}
