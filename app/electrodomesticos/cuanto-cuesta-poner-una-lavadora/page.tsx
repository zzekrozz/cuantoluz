import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import PriceLiveWidget from '@/components/PriceLiveWidget';

export const metadata: Metadata = buildMetadata({
  title: 'Cuánto cuesta poner una lavadora hoy en España',
  description: 'Calcula cuánto te cuesta poner una lavadora hoy según el precio del PVPC. Coste medio por programa, comparativas y trucos para gastar menos.',
  path: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora',
  keywords: ['cuanto cuesta poner una lavadora', 'precio lavadora', 'coste lavado', 'lavadora consumo precio'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
  { name: 'Cuánto cuesta poner una lavadora', url: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora' },
];

export default function CuantoCuestaLavadoraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Cuánto cuesta poner una lavadora hoy en España',
        description: 'Guía con coste real por programa, hora y eficiencia.',
        url: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora',
        datePublished: '2026-05-01',
        dateModified: new Date().toISOString(),
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Cuánto cuesta poner una lavadora hoy</h1>
        <p className="lead">
          El coste de una lavadora hoy en España oscila entre <strong>5 y 25 céntimos</strong>, dependiendo del programa, la eficiencia del aparato y la hora a la que la pongas. Te explicamos todos los factores.
        </p>

        <PriceLiveWidget variant="full" ctaText="Ver tabla por horas" />

        <section className="article-content">
          <h2>Coste medio por programa de lavado</h2>
          <p>Estos son los costes aproximados con el precio medio del PVPC (entorno a 0,15€/kWh):</p>
          <ul>
            <li><strong>Eco 40-60:</strong> 0,5-0,8 kWh × 0,15€ = <strong>~8-12 céntimos</strong></li>
            <li><strong>Frío 20°C:</strong> 0,3 kWh × 0,15€ = <strong>~4-5 céntimos</strong></li>
            <li><strong>30°C:</strong> 0,5 kWh × 0,15€ = <strong>~7-8 céntimos</strong></li>
            <li><strong>40°C:</strong> 0,8 kWh × 0,15€ = <strong>~12 céntimos</strong></li>
            <li><strong>60°C:</strong> 1,2 kWh × 0,15€ = <strong>~18 céntimos</strong></li>
            <li><strong>90°C:</strong> 2,0 kWh × 0,15€ = <strong>~30 céntimos</strong></li>
          </ul>

          <h2>¿Cuánto influye la hora del día?</h2>
          <p>
            Mucho. La diferencia entre poner la lavadora en la mejor o la peor hora puede ser de <strong>50% o más</strong>. Si lavas a 0,08€/kWh en lugar de 0,22€/kWh, una lavadora a 40°C te cuesta 6 céntimos en lugar de 18. Multiplicado por 4 lavados a la semana son <strong>25€ al año</strong> solo por elegir bien la hora.
          </p>
          <p>
            Mira la <Link href="/electrodomesticos/mejor-hora-poner-lavadora">mejor hora de hoy</Link> para optimizar.
          </p>

          <h2>¿Cuánto influye la eficiencia de la lavadora?</h2>
          <p>
            Una lavadora de <strong>clase A</strong> consume aproximadamente un 30% menos que una de clase D. Si tu lavadora tiene más de 10 años, probablemente esté gastando mucho más de lo necesario. La diferencia anual puede ser de <strong>40-80€</strong> según el número de lavados.
          </p>

          <h2>Cómo gastar menos en cada lavado</h2>
          <p>Algunos trucos que sí funcionan:</p>
          <ul>
            <li>Usa el programa <strong>Eco 40-60</strong> siempre que puedas</li>
            <li>Llena la lavadora (sin pasarte)</li>
            <li>Lava con agua fría cuando la ropa no esté muy sucia</li>
            <li>Programa el inicio diferido para la hora más barata del día</li>
            <li>Mantén el filtro limpio para que no fuerce el motor</li>
          </ul>

          <h2>Calcula tu coste exacto</h2>
          <p>
            Para saber exactamente cuánto te cuesta tu lavadora hoy, usa la <Link href="/calculadoras/lavadora">calculadora de lavadora</Link>. Elige tu programa, la hora y la eficiencia de tu aparato y verás el coste real con los precios del PVPC actualizados.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Calculadora de lavadora', description: 'Cuánto cuesta cada lavado según tu programa.', url: '/calculadoras/lavadora' },
          { title: 'Mejor hora para poner la lavadora HOY', description: 'Dato vivo actualizado.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
          { title: 'Cuánto consume una lavadora', description: 'Consumo en kWh por programa.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
          { title: 'Programa Eco 40-60', description: 'El más eficiente.', url: '/electrodomesticos/programa-eco-40-60' },
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
