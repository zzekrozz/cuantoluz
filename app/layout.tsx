import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookiesBanner from '@/components/CookiesBanner';

export const metadata: Metadata = {
  title: 'CuantoLuz — Precio de la luz hoy en España, hora a hora',
  description: 'Consulta el precio de la luz en España hoy. Calcula cuánto te costará cada electrodoméstico, descubre las horas baratas y ahorra en tu factura eléctrica.',
  keywords: 'precio luz hoy, PVPC, precio kWh, hora barata luz, calculadora luz, factura eléctrica',
  openGraph: {
    title: 'CuantoLuz — Precio de la luz hoy',
    description: 'Mira cuánto cuesta la luz a cada hora y calcula tu factura.',
    url: 'https://cuantoluz.es',
    siteName: 'CuantoLuz',
    locale: 'es_ES',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="glow-top" />
        <div className="container">
          <Header />
          {children}
        </div>
        <Footer />
        <CookiesBanner />
      </body>
    </html>
  );
}
