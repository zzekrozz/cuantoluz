import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, buildFAQSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import PriceLiveWidget from '@/components/PriceLiveWidget';

export const metadata: Metadata = buildMetadata({
  title: 'Qué es el PVPC | La tarifa regulada de la luz explicada',
  description: 'El PVPC es la tarifa regulada de electricidad en España. Te explicamos qué es, cómo funciona, quién puede contratarla y si te conviene o no.',
  path: '/guias/que-es-pvpc',
  keywords: ['que es el pvpc', 'pvpc tarifa', 'tarifa regulada luz', 'precio voluntario pequeño consumidor'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Guías', url: '/guias' },
  { name: '¿Qué es el PVPC?', url: '/guias/que-es-pvpc' },
];

const faqs = [
  { question: '¿Qué significa PVPC?', answer: 'PVPC significa Precio Voluntario para el Pequeño Consumidor. Es la tarifa regulada por el Gobierno español para los hogares con potencia contratada inferior a 10 kW.' },
  { question: '¿Quién puede contratar el PVPC?', answer: 'Cualquier hogar con potencia contratada inferior a 10 kW. La inmensa mayoría de viviendas particulares en España cumplen este requisito.' },
  { question: '¿El PVPC es más barato que el mercado libre?', answer: 'Depende. El PVPC suele ser más barato en años con generación renovable abundante, pero puede ser más caro en picos puntuales. A largo plazo, suele ofrecer mejor precio si gestionas bien las horas de consumo.' },
  { question: '¿Cómo cambio al PVPC?', answer: 'Tienes que contratar el PVPC con una de las 8 comercializadoras de referencia (Curenergía, Energía XXI, Régsiti, etc.). El cambio es gratuito y no implica obras.' },
];

export default function QueEsPVPCPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: '¿Qué es el PVPC?',
        description: 'La tarifa regulada de electricidad explicada.',
        url: '/guias/que-es-pvpc',
        datePublished: '2026-05-01',
      }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildFAQSchema(faqs))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>¿Qué es el PVPC?</h1>
        <p className="lead">
          El <strong>PVPC</strong> (Precio Voluntario para el Pequeño Consumidor) es la <strong>tarifa eléctrica regulada</strong> en España. Su precio lo fija el Gobierno y cambia hora a hora según el mercado mayorista de electricidad.
        </p>

        <PriceLiveWidget variant="full" />

        <section className="article-content">
          <h2>¿Qué significa PVPC?</h2>
          <p>
            PVPC son las siglas de <strong>Precio Voluntario para el Pequeño Consumidor</strong>. Es una tarifa <strong>regulada</strong> (la fija el Gobierno, no las compañías) y la pueden contratar todos los hogares con potencia inferior a <strong>10 kW</strong>, que es la inmensa mayoría.
          </p>
          <p>
            La principal característica del PVPC es que <strong>el precio cambia cada hora del día</strong>. Esto significa que pagas diferente según cuándo consumas. Hay horas baratas (típicamente noche y sobremesa) y horas caras (típicamente 20:00-22:00).
          </p>

          <h2>¿Cómo se calcula el precio?</h2>
          <p>
            El precio del PVPC tiene dos partes: el coste de la <strong>energía</strong> y el coste del <strong>peaje y cargos</strong> (regulado). La parte de energía sale del mercado mayorista, donde productores y comercializadores cruzan ofertas y demanda cada hora. Cuando hay mucha generación renovable (sol, viento), el precio baja; cuando hay poca, sube.
          </p>
          <p>
            <strong>Red Eléctrica de España</strong> publica los precios del día siguiente cada tarde a partir de las <strong>20:15h</strong>. Una vez publicado, el precio no cambia.
          </p>

          <h2>¿Quién puede contratar el PVPC?</h2>
          <p>
            Cualquier hogar con potencia inferior a 10 kW. Solo lo ofrecen las <strong>8 comercializadoras de referencia</strong> (Curenergía, Energía XXI, Régsiti, etc.). No lo ofrecen Iberdrola Comercial, Naturgy, Endesa Energía ni el resto de comercializadoras del mercado libre.
          </p>

          <h2>¿Me conviene el PVPC?</h2>
          <p>
            Te conviene si:
          </p>
          <ul>
            <li>Tienes <strong>flexibilidad de horarios</strong> para usar electrodomésticos cuando es barato</li>
            <li>No te importa que la factura varíe de mes a mes</li>
            <li>Tienes coche eléctrico que puedes cargar de madrugada</li>
            <li>Tu vivienda no consume mucho en horas pico (20:00-22:00)</li>
          </ul>
          <p>
            No te conviene si:
          </p>
          <ul>
            <li>Necesitas <strong>estabilidad de precio</strong> al mes</li>
            <li>Tu consumo se concentra en horas caras</li>
            <li>Tienes un negocio en casa que consume durante todo el día sin posibilidad de moverlo</li>
          </ul>

          <h2>¿PVPC o mercado libre?</h2>
          <p>
            Es una decisión personal. Si te interesa la comparativa completa, mira nuestra guía sobre <Link href="/guias/mercado-regulado-vs-mercado-libre">mercado regulado vs mercado libre</Link>.
          </p>

          <h2>Preguntas frecuentes</h2>
          {faqs.map(faq => (
            <div key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        <RelatedLinks links={[
          { title: 'Mercado regulado vs mercado libre', description: 'Diferencias y cómo elegir.', url: '/guias/mercado-regulado-vs-mercado-libre' },
          { title: 'Cómo funciona el precio de la luz por horas', description: 'El detalle técnico.', url: '/guias/como-funciona-precio-luz-por-horas' },
          { title: 'Precio de la luz hoy', description: 'Consulta el precio actualizado.', url: '/' },
          { title: 'Cómo ahorrar luz en casa', description: 'Trucos prácticos.', url: '/guias/como-ahorrar-luz-en-casa' },
        ]} />
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 17px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-page .lead strong { color: var(--text); font-weight: 700; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 28px 0 12px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content h3 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin: 18px 0 8px; color: var(--text); }
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
