import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import PriceLiveWidget from '@/components/PriceLiveWidget';

export const metadata: Metadata = buildMetadata({
  title: 'Cuánto consume un aire acondicionado | Consumo por hora y trucos',
  description: 'Cuánto consume un aire acondicionado por hora según el tipo: inverter, antiguo, splits. Coste mensual y trucos para gastar menos.',
  path: '/electrodomesticos/cuanto-consume-un-aire-acondicionado',
  keywords: ['cuanto consume aire acondicionado', 'consumo aire por hora', 'aire inverter consumo', 'aire acondicionado kw'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
  { name: 'Cuánto consume un aire acondicionado', url: '/electrodomesticos/cuanto-consume-un-aire-acondicionado' },
];

export default function CuantoConsumeAirePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Cuánto consume un aire acondicionado',
        description: 'Consumo por hora y por mes según el tipo de equipo.',
        url: '/electrodomesticos/cuanto-consume-un-aire-acondicionado',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Cuánto consume un aire acondicionado</h1>
        <p className="lead">
          Un aire acondicionado consume entre <strong>0,8 y 3 kWh por hora</strong> según el tipo y tamaño. Los inverter modernos consumen mucho menos que los antiguos. Te explicamos todo.
        </p>

        <PriceLiveWidget variant="full" ctaText="Ver precio por horas" />

        <section className="article-content">
          <h2>Consumo según el tipo de aire</h2>
          <ul>
            <li><strong>Inverter pequeño (1x1, salón pequeño):</strong> 0,8-1,0 kWh/hora</li>
            <li><strong>Inverter mediano (habitación grande):</strong> 1,0-1,4 kWh/hora</li>
            <li><strong>Inverter grande (multi-split):</strong> 1,5-2,0 kWh/hora</li>
            <li><strong>Antiguo mediano:</strong> 1,8-2,5 kWh/hora</li>
            <li><strong>Antiguo grande:</strong> 2,5-3,5 kWh/hora</li>
            <li><strong>Portátil:</strong> 0,8-1,5 kWh/hora (menos eficientes que los split)</li>
          </ul>

          <h2>Coste por hora con el PVPC</h2>
          <p>
            Con un precio medio del PVPC de 0,15€/kWh, encender un aire inverter mediano cuesta unos <strong>15-20 céntimos por hora</strong>. Uno antiguo grande puede pasar de <strong>50 céntimos por hora</strong>. En hora cara la diferencia se dispara: el antiguo puede costar 70-80 céntimos por hora.
          </p>

          <h2>Coste mensual estimado</h2>
          <p>
            Si tienes el aire encendido <strong>4 horas al día durante 90 días</strong> del verano:
          </p>
          <ul>
            <li>Inverter mediano: 360 kWh × 0,15€ = <strong>54€ al verano</strong></li>
            <li>Antiguo mediano: 720 kWh × 0,15€ = <strong>108€ al verano</strong></li>
            <li>Antiguo grande: 1.080 kWh × 0,15€ = <strong>162€ al verano</strong></li>
          </ul>

          <h2>Trucos que sí funcionan</h2>
          <p>
            La temperatura ideal es <strong>24-26°C</strong>. Cada grado por debajo aumenta el consumo entre un 6% y 8%. Pon <strong>24°C con ventilador</strong> en lugar de 22°C sin ventilador y notarás lo mismo gastando menos.
          </p>
          <ul>
            <li>Usa el modo eco/auto si lo tiene</li>
            <li>Cierra persianas o cortinas durante las horas de sol</li>
            <li>Refresca la casa antes de la franja cara (20:00-22:00)</li>
            <li>Limpia los filtros una vez al mes</li>
            <li>Si vas a estar fuera más de 2 horas, apágalo</li>
          </ul>

          <h2>Calcula tu coste real</h2>
          <p>
            Para saber exactamente cuánto te cuesta tu aire según el modelo y las horas, usa la <Link href="/calculadoras/aire-acondicionado">calculadora de aire acondicionado</Link>.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Calculadora de aire acondicionado', description: 'Coste exacto por hora.', url: '/calculadoras/aire-acondicionado' },
          { title: 'Precio de la luz hoy', description: 'Para elegir mejor hora.', url: '/' },
          { title: 'Cómo ahorrar luz en casa', description: 'Más trucos.', url: '/guias/como-ahorrar-luz-en-casa' },
          { title: 'Qué electrodomésticos consumen más', description: 'Ranking completo.', url: '/guias/que-electrodomesticos-consumen-mas' },
        ]} />
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 17px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-page .lead strong { color: var(--text); font-weight: 700; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 28px 0 12px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 14px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        .article-content ul { margin: 14px 0; padding-left: 22px; }
        .article-content li { margin-bottom: 8px; line-height: 1.7; color: var(--text-soft); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
