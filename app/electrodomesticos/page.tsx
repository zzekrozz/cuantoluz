import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Consumo y coste de electrodomésticos | Guías prácticas',
  description: 'Guías sobre el consumo y coste real de los electrodomésticos: lavadora, lavavajillas, aire acondicionado, horno y más. Datos actualizados con el precio de la luz.',
  path: '/electrodomesticos',
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
];

const articles = [
  { title: 'Cuánto cuesta poner una lavadora hoy', desc: 'Coste real según el programa y la hora.', url: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora' },
  { title: 'Cuánto consume una lavadora', desc: 'Consumo en kWh por programa y clase energética.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
  { title: 'Mejor hora para poner la lavadora hoy', desc: 'Dato vivo con el precio del día actual.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
  { title: 'Programa Eco 40-60', desc: 'Por qué tarda más pero gasta menos.', url: '/electrodomesticos/programa-eco-40-60' },
  { title: 'Cuánto consume un aire acondicionado', desc: 'Consumo por hora según el tipo y la potencia.', url: '/electrodomesticos/cuanto-consume-un-aire-acondicionado' },
  { title: 'Cuánto consume un lavavajillas', desc: 'kWh por ciclo y diferencias entre programas.', url: '/electrodomesticos/cuanto-consume-un-lavavajillas' },
];

export default function ElectrodomesticosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="hub-h1">Consumo y coste de electrodomésticos</h1>
      <p className="hub-lead">
        Guías prácticas sobre cuánto consume y cuesta cada electrodoméstico, con datos actualizados según el precio del PVPC de hoy.
      </p>

      <div className="art-list">
        {articles.map(a => (
          <Link key={a.url} href={a.url} className="art-card">
            <div className="art-card-title">
              {a.title}
              <ArrowRight size={14} className="art-arrow" />
            </div>
            <div className="art-card-desc">{a.desc}</div>
          </Link>
        ))}
      </div>

      <style>{`
        .hub-h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 36px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; }
        .hub-lead { font-size: 16px; color: var(--text-soft); margin-bottom: 32px; line-height: 1.6; }
        .art-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .art-card { display: block; padding: 18px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; text-decoration: none; transition: all 0.2s; }
        .art-card:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
        .art-card-title { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; line-height: 1.3; }
        .art-arrow { color: var(--accent); flex-shrink: 0; }
        .art-card-desc { font-size: 13px; color: var(--text-soft); line-height: 1.5; }
      `}</style>
    </>
  );
}
