import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';

export const metadata: Metadata = buildMetadata({
  title: 'Cuánto consume un lavavajillas | kWh y litros por ciclo',
  description: 'Cuánto consume un lavavajillas: kWh y litros por ciclo según el programa. Comparativa entre programas y cuánto cuesta al mes.',
  path: '/electrodomesticos/cuanto-consume-un-lavavajillas',
  keywords: ['cuanto consume lavavajillas', 'consumo lavavajillas kwh', 'litros lavavajillas', 'lavavajillas eco consumo'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
  { name: 'Cuánto consume un lavavajillas', url: '/electrodomesticos/cuanto-consume-un-lavavajillas' },
];

export default function CuantoConsumeLavavajillasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Cuánto consume un lavavajillas',
        description: 'Análisis del consumo eléctrico y de agua.',
        url: '/electrodomesticos/cuanto-consume-un-lavavajillas',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Cuánto consume un lavavajillas</h1>
        <p className="lead">
          Un lavavajillas moderno consume entre <strong>0,8 y 1,8 kWh por ciclo</strong> y entre <strong>8 y 16 litros de agua</strong>. El programa Eco es el más eficiente. Te lo contamos todo.
        </p>

        <section className="article-content">
          <h2>Consumo por programa</h2>
          <ul>
            <li><strong>Eco:</strong> 0,8-1,0 kWh y 8-10 litros de agua (3-4h de duración)</li>
            <li><strong>Normal:</strong> 1,2-1,4 kWh y 10-12 litros (2h)</li>
            <li><strong>Rápido:</strong> 0,9-1,2 kWh y 9-11 litros (30 min, pero más vatios de pico)</li>
            <li><strong>Intensivo:</strong> 1,5-1,8 kWh y 14-16 litros (2,5h con agua a 70°C)</li>
          </ul>

          <h2>¿Por qué el Eco gasta menos si tarda más?</h2>
          <p>
            Igual que en la lavadora: <strong>calentar el agua es lo que más electricidad consume</strong>. El programa eco calienta el agua a menor temperatura (50-55°C en lugar de 70°C) y la mantiene más tiempo. Limpia igual y gasta menos.
          </p>

          <h2>Coste anual</h2>
          <p>
            Si pones el lavavajillas <strong>5 veces a la semana en programa Eco</strong>: 0,9 kWh × 5 × 52 = <strong>234 kWh al año</strong>. Con el PVPC medio (0,15€/kWh), son <strong>35€</strong>. En horas baratas, baja a 22-25€.
          </p>
          <p>
            Si lo usas en programa Normal, sube a <strong>50-55€</strong>. Si lo usas Intensivo, puede pasar de 70€.
          </p>

          <h2>¿Lavavajillas o lavar a mano?</h2>
          <p>
            Sorprendentemente, el lavavajillas suele <strong>gastar menos agua y energía</strong> que lavar a mano si pones la carga completa. Si lavas pocas cosas a mano puedes gastar 30-40 litros, mientras que el lavavajillas con 10. Y si calientas agua para el fregadero, gastas más electricidad también.
          </p>

          <h2>Cómo gastar menos</h2>
          <ul>
            <li>Usa siempre el <strong>programa Eco</strong> salvo que la vajilla esté muy sucia</li>
            <li>Espera a llenarlo del todo antes de ponerlo</li>
            <li>No prelaves a mano: el lavavajillas ya lo hace</li>
            <li>Ponlo en <strong>hora barata</strong>: la diferencia puede ser del 50%</li>
            <li>Mantén los filtros limpios</li>
          </ul>

          <h2>Calcula tu caso</h2>
          <p>
            Usa la <Link href="/calculadoras/lavavajillas">calculadora de lavavajillas</Link> para saber cuánto te cuesta cada ciclo según el programa y la hora.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Calculadora de lavavajillas', description: 'Coste exacto por ciclo.', url: '/calculadoras/lavavajillas' },
          { title: 'Precio de la luz hoy', description: 'Para elegir mejor hora.', url: '/' },
          { title: 'Cuánto consume una lavadora', description: 'Comparativa con la lavadora.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
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
