import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';

export const metadata: Metadata = buildMetadata({
  title: 'Mercado regulado vs mercado libre | Diferencias y cómo elegir',
  description: 'Diferencias entre el mercado regulado (PVPC) y el mercado libre de electricidad. Te explicamos las ventajas, los riesgos y cómo elegir el que más te conviene.',
  path: '/guias/mercado-regulado-vs-mercado-libre',
  keywords: ['mercado regulado vs libre', 'PVPC vs mercado libre', 'tarifa libre o regulada', 'diferencias mercado luz'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Guías', url: '/guias' },
  { name: 'Mercado regulado vs mercado libre', url: '/guias/mercado-regulado-vs-mercado-libre' },
];

export default function MercadoReguladoLibrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Mercado regulado vs mercado libre',
        description: 'Diferencias y cómo elegir entre ambos mercados eléctricos.',
        url: '/guias/mercado-regulado-vs-mercado-libre',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Mercado regulado vs mercado libre: cómo elegir</h1>
        <p className="lead">
          En España puedes contratar la luz en el <strong>mercado regulado</strong> (PVPC, fijado por el Gobierno) o en el <strong>mercado libre</strong> (precio negociado con la compañía). Te explicamos las diferencias y qué te conviene.
        </p>

        <section className="article-content">
          <h2>¿Qué es el mercado regulado?</h2>
          <p>
            El mercado regulado se basa en una sola tarifa: el <strong>PVPC</strong> (Precio Voluntario para el Pequeño Consumidor). Su precio lo fija el Gobierno y <strong>cambia hora a hora</strong> según el mercado mayorista de electricidad.
          </p>
          <p>
            Solo lo ofrecen las <strong>8 comercializadoras de referencia</strong>: Curenergía, Energía XXI, Régsiti, Comercializador de Referencia Energético, Baser y otras. No hay margen comercial.
          </p>

          <h2>¿Qué es el mercado libre?</h2>
          <p>
            En el mercado libre, cada comercializadora (Iberdrola, Naturgy, Endesa, Total, Repsol, Holaluz, Octopus, etc.) <strong>negocia su propio precio</strong>. Puede ofrecerte un precio fijo durante 12 meses, una tarifa con tramos horarios propios, una tarifa indexada al mercado, etc.
          </p>
          <p>
            Lo importante: en el mercado libre <strong>no hay control de precios</strong>. La compañía pone el precio que quiere y tú decides si lo aceptas.
          </p>

          <h2>Tabla comparativa</h2>
          <ul>
            <li><strong>Precio:</strong> Regulado = variable (hora a hora). Libre = generalmente fijo durante un periodo.</li>
            <li><strong>Quién lo fija:</strong> Regulado = Gobierno. Libre = comercializadora.</li>
            <li><strong>Estabilidad:</strong> Regulado = factura variable. Libre = factura estable.</li>
            <li><strong>Riesgo:</strong> Regulado = subes y bajas con el mercado. Libre = precio acordado, sin sorpresas.</li>
            <li><strong>Permanencia:</strong> Regulado = no. Libre = depende de la oferta.</li>
            <li><strong>Comercializadoras:</strong> Regulado = solo 8. Libre = más de 100.</li>
          </ul>

          <h2>¿Cuál es más barato?</h2>
          <p>
            <strong>Depende del año</strong>. Históricamente, el PVPC ha salido más barato cuando hay generación renovable abundante. Pero en momentos de crisis (como 2021-2022 con la guerra de Ucrania), el PVPC se disparó y el mercado libre con precio fijo salió mucho mejor.
          </p>
          <p>
            Si comparas <strong>precios actuales</strong>, el PVPC suele estar 1-3 céntimos por debajo del mercado libre medio. Pero el mercado libre te da <strong>estabilidad</strong>: sabes exactamente lo que pagarás.
          </p>

          <h2>¿Cuál te conviene a ti?</h2>
          <p>
            <strong>Te conviene el PVPC si:</strong>
          </p>
          <ul>
            <li>Tienes flexibilidad para mover tu consumo a horas baratas</li>
            <li>No te importa que la factura varíe</li>
            <li>Quieres pagar el precio "real" del mercado</li>
            <li>Tienes coche eléctrico y cargas de madrugada</li>
          </ul>
          <p>
            <strong>Te conviene el mercado libre si:</strong>
          </p>
          <ul>
            <li>Prefieres saber exactamente cuánto pagarás cada mes</li>
            <li>Tu consumo se concentra en horas caras y no puedes moverlo</li>
            <li>Quieres servicios extra (mantenimiento, seguros, etc.)</li>
            <li>Encuentras una oferta puntualmente muy buena</li>
          </ul>

          <h2>Cómo cambiar de uno a otro</h2>
          <p>
            El cambio es <strong>gratuito y sin obras</strong>. Solo tienes que contratar con la nueva comercializadora y ella se encarga del proceso. Tarda entre 1 y 3 semanas. No te quedas sin luz en ningún momento.
          </p>
          <p>
            Si quieres cambiar al PVPC, contacta con cualquiera de las 8 comercializadoras de referencia. Si quieres cambiar al mercado libre, contacta directamente con la compañía elegida.
          </p>

          <h2>Consejo final</h2>
          <p>
            <strong>No hay una respuesta universal</strong>. Lo más importante es entender tu consumo: ¿cuándo usas la luz?, ¿cuánto consume tu casa al mes?, ¿qué importancia tiene la estabilidad del precio para ti? Con eso claro, la decisión sale sola.
          </p>
          <p>
            Y, en cualquiera de los dos casos, mover el consumo a las horas baratas siempre ayuda. Mira la <Link href="/">página principal</Link> para ver cuáles son las horas baratas hoy.
          </p>
        </section>

        <RelatedLinks links={[
          { title: '¿Qué es el PVPC?', description: 'Explicación detallada de la tarifa regulada.', url: '/guias/que-es-pvpc' },
          { title: 'Cómo funciona el precio de la luz por horas', description: 'Para entender el PVPC.', url: '/guias/como-funciona-precio-luz-por-horas' },
          { title: 'Cómo ahorrar luz en casa', description: 'Funciona con cualquier tarifa.', url: '/guias/como-ahorrar-luz-en-casa' },
          { title: 'Precio de la luz hoy', description: 'Datos del PVPC actualizados.', url: '/' },
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
