import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Heart className="h-5 w-5 fill-primary text-primary" />
              Ayuda Solidaria
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Plataforma de crowdfunding solidario en Argentina. Conectamos a quienes
              necesitan ayuda con quienes pueden darla, con total transparencia.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/campanas" className="hover:text-foreground">Campañas</Link></li>
              <li><Link href="/crear-campana" className="hover:text-foreground">Crear campaña</Link></li>
              <li><Link href="/como-funciona" className="hover:text-foreground">Cómo funciona</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terminos" className="hover:text-foreground">Términos</Link></li>
              <li><Link href="/privacidad" className="hover:text-foreground">Privacidad</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ayuda Solidaria. Todos los derechos reservados.</p>
          <p className="mt-1 text-xs">
            * El porcentaje que llega a la causa depende de las comisiones configuradas
            (plataforma + procesador de pagos).
          </p>
        </div>
      </div>
    </footer>
  );
}
