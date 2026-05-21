import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Guías sobre el precio de la luz y el ahorro eléctrico',
  description: 'Guías prácticas sobre el PVPC, el mercado libre, cómo funciona el precio de la luz y trucos para ahorrar en tu factura eléctrica.',
  path: '/guias',
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Guías', url: '/guias' },
];

const guides = [
  { title: '¿Qué es el PVPC?', desc: 'La tarifa regulada explicada de forma sencilla.', url: '/guias/que-es-pvpc' },
  { title: 'Mercado regulado vs mercado libre', desc: 'Diferencias, ventajas y cómo elegir.', url: '/guias/mercado-regulado-vs-mercado-libre' },
  { title: 'Cómo funciona el precio de la luz por horas', desc: 'Por qué cambia y de qué depende.', url: '/guias/como-funciona-precio-luz-por-horas' },
  { title: 'Cómo ahorrar luz en casa', desc: 'Trucos reales que sí reducen tu factura.', url: '/guias/como-ahorrar-luz-en-casa' },
  { title: 'Qué electrodomésticos consumen más', desc: 'Ranking y datos reales de consumo.', url: '/guias/que-electrodomesticos-consumen-mas' },
];

export default function GuiasHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="hub-h1">Guías sobre el precio de la luz</h1>
      <p className="hub-lead">
        Aprende cómo funciona el precio de la luz en España, qué tarifa te conviene y cómo reducir tu factura.
      </p>

      <div className="guide-list">
        {guides.map(g => (
          <Link key={g.url} href={g.url} className="guide-card">
            <div className="guide-card-title">
              {g.title}
              <ArrowRight size={14} className="guide-arrow" />
            </div>
            <div className="guide-card-desc">{g.desc}</div>
          </Link>
        ))}
      </div>

      <style>{`
        .hub-h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 36px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; }
        .hub-lead { font-size: 16px; color: var(--text-soft); margin-bottom: 32px; line-height: 1.6; }
        .guide-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .guide-card { display: block; padding: 18px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; text-decoration: none; transition: all 0.2s; }
        .guide-card:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
        .guide-card-title { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; line-height: 1.3; }
        .guide-arrow { color: var(--accent); flex-shrink: 0; }
        .guide-card-desc { font-size: 13px; color: var(--text-soft); line-height: 1.5; }
      `}</style>
    </>
  );
}
