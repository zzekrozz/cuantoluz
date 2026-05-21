import type { Metadata } from 'next';
import { buildMetadata, buildCalculatorSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import LavadoraCalculator from './LavadoraCalculator';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: 'Calculadora de lavadora | Cuánto cuesta poner una lavadora hoy',
  description: 'Calcula cuánto te cuesta poner la lavadora hoy según el precio de la luz, el programa y la hora. Compara con la mejor hora del día y descubre cuánto puedes ahorrar.',
  path: '/calculadoras/lavadora',
  keywords: ['calculadora lavadora', 'cuánto cuesta poner una lavadora', 'consumo lavadora kWh', 'lavadora precio luz'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Calculadoras', url: '/calculadoras' },
  { name: 'Lavadora', url: '/calculadoras/lavadora' },
];

const calculatorSchema = buildCalculatorSchema({
  name: 'Calculadora de coste de una lavadora',
  description: 'Herramienta para calcular cuánto cuesta poner una lavadora según el precio de la luz, programa y hora del día.',
  url: '/calculadoras/lavadora',
  category: 'UtilityApplication',
});

export default function CalculadoraLavadoraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(calculatorSchema)}
      />

      <Breadcrumbs items={breadcrumbs} />

      <article className="calc-page">
        <h1>Calculadora de coste de una lavadora</h1>
        <p className="lead">
          Descubre cuánto te cuesta poner una lavadora hoy según el precio de la luz, el programa elegido y la hora del día. Te mostramos también el coste en la mejor y la peor hora para que sepas cuánto puedes ahorrar.
        </p>

        {/* CALCULADORA */}
        <LavadoraCalculator />

        {/* CONTENIDO EDITORIAL SEO */}
        <section className="calc-content">
          <h2>¿Cuánto cuesta poner una lavadora en España?</h2>
          <p>
            El coste de una lavadora depende de tres cosas: el <strong>consumo del programa</strong>, el <strong>precio de la luz en ese momento</strong> y la <strong>eficiencia de tu lavadora</strong>. Una lavadora moderna de clase A consume alrededor de 0,5-0,8 kWh por ciclo, mientras que una antigua puede llegar a 1,5 kWh.
          </p>
          <p>
            Con el precio medio actual del PVPC en España, una lavadora estándar cuesta entre <strong>5 y 25 céntimos por lavado</strong>. La diferencia entre ponerla a la peor hora o a la mejor puede ser de más del <strong>50%</strong>.
          </p>

          <h2>¿Cuánto consume una lavadora según su programa?</h2>
          <p>
            El programa que elijas tiene un impacto enorme. Estos son los consumos aproximados:
          </p>
          <ul>
            <li><strong>Programa Eco 40-60:</strong> 0,5-0,8 kWh (el más eficiente)</li>
            <li><strong>Programa a 30°C:</strong> 0,4-0,6 kWh</li>
            <li><strong>Programa a 40°C:</strong> 0,7-1,0 kWh</li>
            <li><strong>Programa a 60°C:</strong> 1,0-1,3 kWh</li>
            <li><strong>Programa a 90°C:</strong> 1,8-2,2 kWh</li>
          </ul>

          <h2>¿Cuál es la mejor hora para poner la lavadora?</h2>
          <p>
            La respuesta cambia cada día. En la <Link href="/electrodomesticos/mejor-hora-poner-lavadora">página de la mejor hora de hoy</Link> mostramos la hora más barata actualizada con los datos vivos del PVPC. Como referencia general, las horas más baratas suelen estar entre las <strong>14:00 y 17:00 en primavera y verano</strong> (gracias a la energía solar) y entre las <strong>2:00 y 6:00 de madrugada en otoño e invierno</strong>.
          </p>

          <h2>¿Cómo funciona esta calculadora?</h2>
          <p>
            Usamos los precios PVPC oficiales de Red Eléctrica de España actualizados cada día. Solo tienes que elegir tu programa, indicar la hora a la que quieres poner la lavadora y la calculadora calcula el coste real distribuyendo el consumo entre las horas del ciclo.
          </p>
        </section>

        <RelatedLinks
          links={[
            { title: 'Cuánto cuesta poner una lavadora', description: 'Guía completa con ejemplos reales.', url: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora' },
            { title: 'Cuánto consume una lavadora', description: 'Todo sobre el consumo en kWh.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
            { title: 'Mejor hora para poner la lavadora hoy', description: 'Dato vivo con el precio de hoy.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
            { title: 'Programa Eco 40-60', description: 'Por qué es el más eficiente.', url: '/electrodomesticos/programa-eco-40-60' },
          ]}
        />
      </article>

      <style>{`
        .calc-page h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 800;
          margin: 8px 0 12px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .calc-page .lead {
          font-size: 16px;
          color: var(--text-soft);
          margin-bottom: 28px;
          line-height: 1.6;
        }
        .calc-content {
          margin-top: 40px;
          padding: 28px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
        }
        .calc-content h2 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin: 24px 0 12px;
        }
        .calc-content h2:first-child { margin-top: 0; }
        .calc-content p {
          color: var(--text-soft);
          line-height: 1.7;
          margin-bottom: 14px;
        }
        .calc-content strong { color: var(--text); font-weight: 700; }
        .calc-content ul {
          margin: 14px 0;
          padding-left: 22px;
        }
        .calc-content li {
          margin-bottom: 8px;
          line-height: 1.7;
          color: var(--text-soft);
        }
        .calc-content a {
          color: var(--accent);
        }

        @media (max-width: 767px) {
          .calc-content { padding: 22px 18px; }
        }
      `}</style>
    </>
  );
}
