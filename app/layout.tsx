import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookiesBanner from '@/components/CookiesBanner';
import Script from 'next/script';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'CuantoLuz — Precio de la luz hoy en España por horas',
    template: '%s | CuantoLuz',
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.authorName }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: SITE_CONFIG.authorName,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'CuantoLuz — Precio de la luz hoy en España',
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CuantoLuz — Precio de la luz hoy',
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    // Añade tu código de Google Search Console aquí cuando lo tengas:
    // google: 'tu-codigo-aqui',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* GOOGLE ANALYTICS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N40S4XBT1E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N40S4XBT1E');
          `}
        </Script>

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
