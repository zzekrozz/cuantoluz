import type { Metadata } from 'next';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Aviso Legal',
  description: 'Aviso legal y términos de uso de CuantoLuz.',
  path: '/aviso-legal',
  noindex: false,
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Aviso Legal', url: '/aviso-legal' },
];

export default function AvisoLegal() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Aviso Legal</h1>
        <p className="lead">
          Términos legales y de uso de la web CuantoLuz.es.
        </p>

        <section className="article-content">
          <h2>Datos identificativos</h2>
          <p>
            <strong>Web:</strong> cuantoluz.es<br />
            <strong>Email de contacto:</strong> cuantoluz@gmail.com
          </p>

          <h2>Objeto</h2>
          <p>
            CuantoLuz.es es una web informativa que muestra el precio de la electricidad en España
            a través de datos públicos de Red Eléctrica de España (REE) y proporciona calculadoras de coste
            eléctrico. El servicio es gratuito y se ofrece tal cual, sin garantías de ningún tipo.
          </p>

          <h2>Exactitud de la información</h2>
          <p>
            Los precios mostrados se obtienen de fuentes oficiales (REE, ESIOS) pero pueden contener
            errores o desfases. CuantoLuz no se hace responsable de decisiones tomadas en base a la
            información mostrada. Para detalles sobre cómo calculamos los datos, consulta nuestra <a href="/metodologia">metodología</a>.
          </p>

          <h2>Propiedad intelectual</h2>
          <p>
            Todos los contenidos de la web (diseño, textos, código) son propiedad de CuantoLuz salvo
            que se indique lo contrario. No está permitida su reproducción sin autorización expresa.
          </p>
          <p>
            Los datos eléctricos pertenecen a Red Eléctrica de España (REE).
          </p>

          <h2>Ley aplicable</h2>
          <p>
            Esta web se rige por la legislación española. Cualquier disputa se resolverá ante los
            juzgados y tribunales españoles.
          </p>
        </section>
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 16px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; margin: 24px 0 10px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 12px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
