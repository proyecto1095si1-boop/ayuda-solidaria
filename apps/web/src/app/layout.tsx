import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Ayuda Solidaria | Crowdfunding solidario en Argentina',
    template: '%s | Ayuda Solidaria',
  },
  description:
    'Plataforma de crowdfunding solidario para Argentina. Ayudá a causas reales con total transparencia. Todas las donaciones llegan a quienes más lo necesitan.',
  keywords: ['crowdfunding', 'donaciones', 'ayuda solidaria', 'Argentina', 'GoFundMe'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Ayuda Solidaria',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
