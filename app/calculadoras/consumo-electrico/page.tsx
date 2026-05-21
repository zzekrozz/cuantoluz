import type { Metadata } from 'next';
import { buildMetadata, buildCalculatorSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import ConsumoCalculator from './ConsumoCalculator';

export const metadata: Metadata = buildMetadata({
  title: 'Calculadora de consumo eléctrico | De vatios a euros',
  description: 'Calcula cuánto consume y cuesta cualquier aparato eléctrico. Pasa de vatios y horas a euros usando el precio de la luz actualizado.',
  path: '/calculadoras/consumo-electrico',
  keywords: ['calculadora consumo electrico', 'vatios a euros', 'calcular kwh', 'cuanto cuesta aparato'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Calculadoras', url: '/calculadoras' },
  { name: 'Consumo eléctrico', url: '/calculadoras/consumo-electrico' },
];

export default function CalcConsumoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildCalculatorSchema({
        name: 'Calculadora general de consumo eléctrico',
        description: 'Calcula el coste de cualquier aparato a partir de su potencia y horas de uso.',
        url: '/calculadoras/consumo-electrico',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="calc-page">
        <h1>Calculadora general de consumo eléctrico</h1>
        <p className="lead">
          Convierte vatios y horas de uso en euros reales según el precio de la luz actual. La herramienta más útil para saber cuánto te cuesta cualquier aparato.
        </p>

        <ConsumoCalculator />

        <section className="calc-content">
          <h2>¿Cómo se calcula el consumo eléctrico?</h2>
          <p>
            La fórmula básica es: <strong>vatios × horas ÷ 1000 = kWh</strong>. Luego multiplicas los kWh por el precio de la luz en ese momento y obtienes el coste en euros. Por ejemplo, un televisor de 100W encendido 5 horas consume 0,5 kWh. Si el precio de la luz es 0,15€/kWh, te ha costado 7,5 céntimos.
          </p>

          <h2>¿Cuántos vatios consume cada aparato?</h2>
          <p>
            Cada aparato tiene su potencia indicada en la etiqueta o el manual. Como referencia:
          </p>
          <ul>
            <li><strong>Televisor LED:</strong> 50-150 W</li>
            <li><strong>Ordenador portátil:</strong> 30-80 W</li>
            <li><strong>Ordenador sobremesa:</strong> 200-500 W</li>
            <li><strong>Frigorífico:</strong> 100-300 W (intermitente)</li>
            <li><strong>Microondas:</strong> 600-1500 W</li>
            <li><strong>Plancha:</strong> 1000-2000 W</li>
            <li><strong>Secador de pelo:</strong> 1500-2500 W</li>
            <li><strong>Horno eléctrico:</strong> 1500-3000 W</li>
            <li><strong>Vitrocerámica:</strong> 1500-2500 W por placa</li>
          </ul>
        </section>

        <RelatedLinks links={[
          { title: 'Precio de la luz hoy', description: 'Datos para tu cálculo.', url: '/' },
          { title: 'Cuánto consume una lavadora', description: 'Guía específica.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
          { title: 'Qué electrodomésticos consumen más', description: 'Ranking de consumos.', url: '/guias/que-electrodomesticos-consumen-mas' },
          { title: 'Cómo ahorrar luz en casa', description: 'Trucos para reducir factura.', url: '/guias/como-ahorrar-luz-en-casa' },
        ]} />
      </article>

      <style>{`
        .calc-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .calc-page .lead { font-size: 16px; color: var(--text-soft); margin-bottom: 28px; line-height: 1.6; }
        .calc-content { margin-top: 40px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .calc-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 24px 0 12px; }
        .calc-content h2:first-child { margin-top: 0; }
        .calc-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 14px; }
        .calc-content strong { color: var(--text); font-weight: 700; }
        .calc-content ul { margin: 14px 0; padding-left: 22px; }
        .calc-content li { margin-bottom: 8px; line-height: 1.7; color: var(--text-soft); }
        @media (max-width: 767px) { .calc-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
