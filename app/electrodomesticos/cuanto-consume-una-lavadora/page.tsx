import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';

export const metadata: Metadata = buildMetadata({
  title: 'Cuánto consume una lavadora | kWh por programa y clase',
  description: 'Cuánto consume una lavadora en kWh según el programa, la clase energética y la temperatura. Datos reales y consejos para reducir el consumo.',
  path: '/electrodomesticos/cuanto-consume-una-lavadora',
  keywords: ['cuanto consume una lavadora', 'consumo lavadora kwh', 'lavadora clase A consumo', 'consumo lavadora por ciclo'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
  { name: 'Cuánto consume una lavadora', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
];

export default function CuantoConsumeLavadoraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Cuánto consume una lavadora',
        description: 'Análisis del consumo en kWh por programa y eficiencia.',
        url: '/electrodomesticos/cuanto-consume-una-lavadora',
        datePublished: '2026-05-01',
        dateModified: new Date().toISOString(),
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Cuánto consume una lavadora</h1>
        <p className="lead">
          Una lavadora moderna consume entre <strong>0,4 y 1,3 kWh por ciclo</strong>, dependiendo del programa, la temperatura y la eficiencia. Te explicamos qué influye más y cómo reducir el consumo.
        </p>

        <section className="article-content">
          <h2>Consumo medio por programa</h2>
          <p>El programa es el factor con más impacto:</p>
          <ul>
            <li><strong>Eco 40-60:</strong> 0,5-0,8 kWh (referencia oficial UE)</li>
            <li><strong>Frío 20°C:</strong> 0,3-0,4 kWh</li>
            <li><strong>30°C corto:</strong> 0,4-0,6 kWh</li>
            <li><strong>40°C estándar:</strong> 0,7-1,0 kWh</li>
            <li><strong>60°C:</strong> 1,0-1,3 kWh</li>
            <li><strong>90°C:</strong> 1,8-2,2 kWh</li>
            <li><strong>Rápido 30 min:</strong> 0,4-0,7 kWh (más W de pico, menos tiempo)</li>
          </ul>

          <h2>Consumo según la clase energética</h2>
          <p>
            Desde 2021 las lavadoras se etiquetan con la nueva escala europea de la A a la G. Una clase A puede consumir entre un <strong>20% y 35% menos</strong> que una C, y casi la mitad que una E o F. Si tu lavadora tiene la antigua etiqueta A+++, equivale aproximadamente a una <strong>B o C</strong> en la nueva escala.
          </p>

          <h2>¿Cuánta agua consume?</h2>
          <p>
            Una lavadora moderna usa entre <strong>40 y 60 litros por ciclo</strong>. Las clases más eficientes están alrededor de los 35-45 litros. El consumo de agua no afecta a tu factura eléctrica pero sí a tu factura del agua.
          </p>

          <h2>Cuánto consume al año</h2>
          <p>
            Si haces <strong>4 lavados a la semana en programa Eco</strong>: 0,7 kWh × 4 × 52 = <strong>145 kWh al año</strong>. Con el PVPC medio (0,15€/kWh), son unos <strong>22€ anuales</strong>. Si pones todos en horas baratas, baja a <strong>14-16€</strong>.
          </p>
          <p>
            Si haces los mismos lavados a 60°C, subes a <strong>250 kWh al año</strong> y unos 37€.
          </p>

          <h2>Cómo reducir el consumo</h2>
          <p>
            La estrategia más eficiente: <strong>llena bien la lavadora</strong> (sin pasarte), usa <strong>programa Eco</strong> y aprovecha <strong>las horas baratas</strong>. Con estas tres cosas reduces el consumo y el coste sin renunciar a tener la ropa limpia.
          </p>
          <p>
            Si quieres saber el coste exacto, usa la <Link href="/calculadoras/lavadora">calculadora de lavadora</Link>.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Cuánto cuesta poner una lavadora', description: 'Coste real según la hora.', url: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora' },
          { title: 'Calculadora de lavadora', description: 'Calcula tu caso concreto.', url: '/calculadoras/lavadora' },
          { title: 'Programa Eco 40-60', description: 'Por qué es el más eficiente.', url: '/electrodomesticos/programa-eco-40-60' },
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
