import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildCalculatorSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import AireCalculator from './AireCalculator';

export const metadata: Metadata = buildMetadata({
  title: 'Calculadora de aire acondicionado | Consumo por hora y coste',
  description: 'Calcula cuánto consume y cuesta tu aire acondicionado por hora según el precio de la luz actual. Compara entre inverter y antiguo.',
  path: '/calculadoras/aire-acondicionado',
  keywords: ['calculadora aire acondicionado', 'consumo aire por hora', 'cuanto gasta aire acondicionado', 'aire inverter consumo'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Calculadoras', url: '/calculadoras' },
  { name: 'Aire acondicionado', url: '/calculadoras/aire-acondicionado' },
];

export default function CalcAirePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildCalculatorSchema({
        name: 'Calculadora de aire acondicionado',
        description: 'Calcula el consumo y coste del aire acondicionado según el precio de la luz.',
        url: '/calculadoras/aire-acondicionado',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="calc-page">
        <h1>Calculadora de consumo de aire acondicionado</h1>
        <p className="lead">
          Descubre cuánto consume tu aire acondicionado por hora y cuánto te cuesta encenderlo con el precio de la luz actual. Compara entre modelos antiguos e inverter.
        </p>

        <AireCalculator />

        <section className="calc-content">
          <h2>¿Cuánto consume un aire acondicionado por hora?</h2>
          <p>
            Un aire acondicionado <strong>inverter moderno</strong> consume entre <strong>0,8 y 1,2 kWh por hora</strong> en uso normal. Uno <strong>antiguo</strong> puede consumir entre <strong>2 y 3 kWh por hora</strong>. Esa diferencia, mantenida varias horas al día durante el verano, hace que un AC antiguo te pueda salir <strong>2 o 3 veces más caro</strong> que uno moderno.
          </p>

          <h2>¿Cuál es la mejor hora para encender el aire?</h2>
          <p>
            En verano las horas más baratas suelen ser de <strong>14:00 a 17:00</strong> (gracias a la generación solar) y la <strong>madrugada</strong>. Las peores son típicamente entre las <strong>20:00 y 22:00</strong>, justo cuando más se usa. Si puedes refrescar la casa antes de esa franja, ahorras mucho.
          </p>

          <h2>Trucos para gastar menos con el aire</h2>
          <p>
            La temperatura ideal es <strong>24-26°C</strong>; cada grado menos consume entre un 6% y un 8% más. Usa el modo eco si tu aparato lo tiene, cierra persianas durante las horas de sol y mantén filtros limpios para que el equipo no fuerce de más.
          </p>
        </section>

        <RelatedLinks
          links={[
            { title: 'Cuánto consume un aire acondicionado', description: 'Guía completa de consumo y ahorro.', url: '/electrodomesticos/cuanto-consume-un-aire-acondicionado' },
            { title: 'Precio de la luz hoy', description: 'Mira si es buena hora para encender el aire.', url: '/' },
            { title: 'Cómo ahorrar luz en casa', description: 'Trucos para reducir tu factura.', url: '/guias/como-ahorrar-luz-en-casa' },
            { title: 'Calculadora general de consumo', description: 'Para cualquier otro aparato.', url: '/calculadoras/consumo-electrico' },
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
