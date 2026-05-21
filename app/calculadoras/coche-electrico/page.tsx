import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildCalculatorSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import CocheElectricoCalculator from './CocheElectricoCalculator';

export const metadata: Metadata = buildMetadata({
  title: 'Calculadora de coche eléctrico | Cuánto cuesta cargarlo en casa',
  description: 'Calcula cuánto cuesta cargar tu coche eléctrico en casa según el precio de la luz actual. Compara con carga rápida y descubre el ahorro frente a la gasolina.',
  path: '/calculadoras/coche-electrico',
  keywords: ['calculadora coche electrico', 'cuanto cuesta cargar coche electrico', 'coche electrico vs gasolina', 'cargar coche en casa'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Calculadoras', url: '/calculadoras' },
  { name: 'Coche eléctrico', url: '/calculadoras/coche-electrico' },
];

const calculatorSchema = buildCalculatorSchema({
  name: 'Calculadora de coste de carga de coche eléctrico',
  description: 'Calcula cuánto cuesta cargar tu coche eléctrico en casa según el precio de la luz.',
  url: '/calculadoras/coche-electrico',
});

export default function CalculadoraCocheElectricoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(calculatorSchema)} />

      <Breadcrumbs items={breadcrumbs} />

      <article className="calc-page">
        <h1>Calcula cuánto cuesta cargar tu coche eléctrico en casa</h1>
        <p className="lead">
          Descubre el coste real de cargar tu coche eléctrico hoy según el precio del PVPC. Compara entre cargar en casa o en una carga rápida, y mira cuánto ahorras frente a la gasolina.
        </p>

        <CocheElectricoCalculator />

        <section className="calc-content">
          <h2>¿Cuánto cuesta cargar un coche eléctrico en casa?</h2>
          <p>
            Depende de tres factores: la <strong>capacidad de la batería</strong>, la <strong>cantidad que cargues</strong> y el <strong>precio de la luz</strong> en ese momento. Con el precio medio del PVPC en España, una carga completa de un coche eléctrico medio (60 kWh de batería) cuesta entre <strong>6 y 15€</strong>.
          </p>
          <p>
            Para que te hagas una idea, hacer 100 km con un coche eléctrico medio cuesta entre <strong>1,5€ y 3€</strong>, mientras que hacerlos con un coche de gasolina cuesta entre <strong>8€ y 12€</strong>. El ahorro es claro y se nota más cuando cargas en las horas baratas del PVPC.
          </p>

          <h2>¿Cuál es la mejor hora para cargar el coche?</h2>
          <p>
            En primavera y verano, las horas más baratas suelen estar entre las <strong>14:00 y 17:00</strong>, cuando hay más generación solar. En otoño e invierno, las mejores horas son de <strong>madrugada (2:00-6:00)</strong>. La <Link href="/">página del precio de la luz hoy</Link> muestra siempre la hora más barata actualizada.
          </p>

          <h2>Carga en casa vs carga rápida</h2>
          <p>
            La carga rápida en exteriores tiene un precio fijo más alto (entre 0,35€ y 0,55€/kWh) y no aprovecha el PVPC. Es cómoda para viajes largos pero <strong>cuesta entre 2 y 4 veces más</strong> que cargar en casa en hora valle. Si tu cargador en casa es de 7,4 kW, en una noche puedes cargar entre 50 y 70 kWh, suficiente para casi cualquier coche.
          </p>
        </section>

        <RelatedLinks
          links={[
            { title: 'Precio de la luz hoy', description: 'Consulta el precio actual para planificar la carga.', url: '/' },
            { title: 'Precio de la luz mañana', description: 'Planifica tu carga del día siguiente.', url: '/precio-luz-manana' },
            { title: 'Calculadora general de consumo', description: 'Calcula el coste de cualquier aparato.', url: '/calculadoras/consumo-electrico' },
            { title: '¿Qué es el PVPC?', description: 'Cómo funciona la tarifa regulada.', url: '/guias/que-es-pvpc' },
          ]}
        />
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
