import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import PriceLiveWidget from '@/components/PriceLiveWidget';

export const metadata: Metadata = buildMetadata({
  title: 'Cómo funciona el precio de la luz por horas en España',
  description: 'Por qué el precio de la luz cambia hora a hora, cómo se calcula y de qué depende. Guía técnica clara para entender el PVPC.',
  path: '/guias/como-funciona-precio-luz-por-horas',
  keywords: ['como funciona precio luz por horas', 'precio luz horario', 'tramos horarios luz', 'mercado mayorista electricidad'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Guías', url: '/guias' },
  { name: 'Cómo funciona el precio de la luz por horas', url: '/guias/como-funciona-precio-luz-por-horas' },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Cómo funciona el precio de la luz por horas',
        description: 'El mecanismo del mercado eléctrico explicado.',
        url: '/guias/como-funciona-precio-luz-por-horas',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Cómo funciona el precio de la luz por horas en España</h1>
        <p className="lead">
          El precio de la luz cambia <strong>cada hora del día</strong> según la oferta y la demanda en el mercado mayorista. Te explicamos cómo funciona el mecanismo y de qué depende que un día sea barato o caro.
        </p>

        <PriceLiveWidget variant="full" />

        <section className="article-content">
          <h2>El mercado mayorista de electricidad</h2>
          <p>
            En España, la electricidad se compra y vende cada día en una <strong>subasta mayorista</strong> gestionada por OMIE. Esta subasta se llama <strong>"mercado diario"</strong> y casa la oferta de productores con la demanda de comercializadores, una hora a la vez.
          </p>
          <p>
            El día anterior, a las <strong>12:00</strong>, los productores presentan sus ofertas (cuánto están dispuestos a vender y a qué precio) y los compradores presentan sus demandas. El sistema cruza ambas y fija un precio único para cada hora del día siguiente.
          </p>

          <h2>Cómo se fija el precio: el sistema marginalista</h2>
          <p>
            España usa el <strong>sistema marginalista</strong>: el precio de toda la energía vendida en una hora lo marca <strong>la tecnología más cara que hace falta para cubrir la demanda</strong>. Si en una hora basta con energía solar y eólica, el precio es muy bajo. Si hace falta gas para cubrir la demanda, el precio sube hasta el coste del gas.
          </p>
          <p>
            Esto explica por qué <strong>los picos de demanda son tan caros</strong>: cuando todos enchufan a la vez (20:00-22:00), hace falta encender centrales caras (gas, ciclo combinado) y eso dispara el precio.
          </p>

          <h2>De qué depende el precio horario</h2>
          <p>
            Cuatro factores principales:
          </p>
          <ul>
            <li><strong>Generación renovable disponible:</strong> si hace viento o sol, baja el precio</li>
            <li><strong>Demanda:</strong> en horas pico sube; en horas valle baja</li>
            <li><strong>Precio del gas:</strong> en horas que hace falta gas, su precio marca el de la luz</li>
            <li><strong>Importaciones y exportaciones:</strong> con Francia y Portugal</li>
          </ul>

          <h2>Patrones típicos del día</h2>
          <p>
            Aunque cada día es distinto, hay patrones que se repiten:
          </p>
          <ul>
            <li><strong>00:00-07:00:</strong> precio bajo (demanda mínima, hay eólica nocturna)</li>
            <li><strong>07:00-11:00:</strong> precio sube (despertador, calderas, transporte)</li>
            <li><strong>11:00-17:00:</strong> precio bajo en primavera/verano por la solar; alto en invierno</li>
            <li><strong>17:00-20:00:</strong> empieza a subir (vuelta a casa)</li>
            <li><strong>20:00-22:00:</strong> pico máximo (cenas, calefacción, ocio)</li>
            <li><strong>22:00-00:00:</strong> empieza a bajar</li>
          </ul>

          <h2>¿Y los peajes? ¿Y los impuestos?</h2>
          <p>
            El precio del mercado mayorista es solo una parte. La factura completa también incluye:
          </p>
          <ul>
            <li><strong>Peajes de transporte y distribución:</strong> regulados, suelen ser fijos por horario (P1 punta, P2 llano, P3 valle)</li>
            <li><strong>Cargos del sistema:</strong> también regulados</li>
            <li><strong>Impuesto eléctrico:</strong> actualmente reducido al 0,5%</li>
            <li><strong>Alquiler del contador:</strong> unos 9-10€ al mes</li>
            <li><strong>IVA:</strong> al 21% (con descuentos puntuales por situaciones excepcionales)</li>
          </ul>

          <h2>¿Por qué este sistema?</h2>
          <p>
            El sistema marginalista se eligió en Europa porque <strong>incentiva la generación renovable</strong>: como las renovables tienen coste marginal cercano a cero, siempre entran las primeras y ganan dinero cuando el precio lo marcan tecnologías más caras. La idea es que con el tiempo, al tener cada vez más renovables, el precio medio baje.
          </p>
          <p>
            Se ha criticado porque <strong>en momentos de crisis del gas</strong> (como en 2022) el precio se dispara para todos, incluso si la mayor parte de la generación fue barata. Por eso ha habido propuestas de reforma, pero por ahora el sistema sigue vigente.
          </p>

          <h2>Cómo aprovechar este conocimiento</h2>
          <p>
            La conclusión práctica es simple: <strong>mira siempre el precio antes de encender cosas grandes</strong>. La lavadora, el lavavajillas, el horno o el aire acondicionado pueden esperar 2-3 horas y costarte la mitad. Mira el <Link href="/">precio de la luz hoy</Link> para ver las horas baratas.
          </p>
        </section>

        <RelatedLinks links={[
          { title: '¿Qué es el PVPC?', description: 'La tarifa regulada explicada.', url: '/guias/que-es-pvpc' },
          { title: 'Mercado regulado vs mercado libre', description: 'Comparativa completa.', url: '/guias/mercado-regulado-vs-mercado-libre' },
          { title: 'Cómo ahorrar luz en casa', description: 'Aplicación práctica.', url: '/guias/como-ahorrar-luz-en-casa' },
          { title: 'Precio de la luz hoy', description: 'Mira los precios actuales.', url: '/' },
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
