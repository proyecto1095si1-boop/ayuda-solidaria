'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Heart, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Heart className="h-6 w-6 fill-primary text-primary" />
          <span>Ayuda Solidaria</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/campanas" className="text-sm font-medium hover:text-primary">
            Campañas
          </Link>
          <Link href="/como-funciona" className="text-sm font-medium hover:text-primary">
            Cómo funciona
          </Link>
          <Link href="/crear-campana" className="text-sm font-medium hover:text-primary">
            Crear campaña
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Cambiar tema"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent sm:inline-flex"
          >
            Ingresar
          </Link>
          <Link
            href="/registro"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            Registrarse
          </Link>

          <button
            className="md:hidden rounded-md p-2 hover:bg-accent"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <Link href="/campanas" className="rounded-md px-3 py-2 hover:bg-accent" onClick={() => setOpen(false)}>
              Campañas
            </Link>
            <Link href="/como-funciona" className="rounded-md px-3 py-2 hover:bg-accent" onClick={() => setOpen(false)}>
              Cómo funciona
            </Link>
            <Link href="/crear-campana" className="rounded-md px-3 py-2 hover:bg-accent" onClick={() => setOpen(false)}>
              Crear campaña
            </Link>
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="flex-1 rounded-lg border px-4 py-2 text-center text-sm" onClick={() => setOpen(false)}>
                Ingresar
              </Link>
              <Link href="/registro" className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm text-primary-foreground" onClick={() => setOpen(false)}>
                Registrarse
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
