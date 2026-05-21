import type { Metadata } from 'next';
import { buildMetadata, buildCalculatorSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import LavavajillasCalculator from './LavavajillasCalculator';

export const metadata: Metadata = buildMetadata({
  title: 'Calculadora de lavavajillas | Cuánto cuesta cada ciclo',
  description: 'Calcula cuánto te cuesta poner el lavavajillas hoy según el programa, la hora y el precio de la luz. Compara entre eco, normal e intensivo.',
  path: '/calculadoras/lavavajillas',
  keywords: ['calculadora lavavajillas', 'cuanto cuesta lavavajillas', 'consumo lavavajillas kwh'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Calculadoras', url: '/calculadoras' },
  { name: 'Lavavajillas', url: '/calculadoras/lavavajillas' },
];

export default function CalcLavavajillasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildCalculatorSchema({
        name: 'Calculadora de coste del lavavajillas',
        description: 'Calcula el coste de cada ciclo del lavavajillas según el precio de la luz.',
        url: '/calculadoras/lavavajillas',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="calc-page">
        <h1>Calculadora de coste del lavavajillas</h1>
        <p className="lead">
          Calcula cuánto te cuesta cada ciclo del lavavajillas según el programa elegido y la hora a la que lo pongas, con el precio del PVPC actualizado.
        </p>

        <LavavajillasCalculator />

        <section className="calc-content">
          <h2>¿Cuánto consume un lavavajillas?</h2>
          <p>
            Un lavavajillas moderno (clase A) consume entre <strong>0,8 y 1,2 kWh por ciclo</strong>. El programa <strong>Eco</strong> es el más eficiente aunque dure más tiempo: usa el agua a menor temperatura y la mantiene más rato en lugar de calentar todo el rato. El programa <strong>intensivo</strong> puede llegar a 1,8 kWh.
          </p>
          <h2>¿Cuál es la mejor hora para ponerlo?</h2>
          <p>
            Igual que con la lavadora, depende del día. Mira el <a href="/">precio de la luz hoy</a> para saber cuál es la hora más barata. En general, evita las franjas de 20:00 a 22:00 y aprovecha la madrugada o la sobremesa.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Cuánto consume un lavavajillas', description: 'Guía detallada.', url: '/electrodomesticos/cuanto-consume-un-lavavajillas' },
          { title: 'Precio de la luz hoy', description: 'Datos actualizados hora a hora.', url: '/' },
          { title: 'Calculadora de lavadora', description: 'Para tus lavados también.', url: '/calculadoras/lavadora' },
          { title: 'Cómo ahorrar luz en casa', description: 'Más trucos.', url: '/guias/como-ahorrar-luz-en-casa' },
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
        .calc-content a { color: var(--accent); }
        @media (max-width: 767px) { .calc-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
