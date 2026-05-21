import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Sobre CuantoLuz | Web del precio de la luz en España',
  description: 'CuantoLuz es una herramienta gratuita que muestra el precio de la luz hora a hora en España con datos oficiales de Red Eléctrica.',
  path: '/sobre',
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Sobre CuantoLuz', url: '/sobre' },
];

export default function Sobre() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Sobre CuantoLuz</h1>
        <p className="lead">
          CuantoLuz nació para que cualquier persona pueda saber, en 5 segundos, cuándo conviene
          encender la lavadora. Sin gráficos confusos, sin webs feas, sin tener que buscar
          en la página oficial del Gobierno.
        </p>

        <section className="article-content">
          <h2>Qué hacemos</h2>
          <p>
            Mostramos el precio de la luz en España hora a hora, con un diseño claro,
            un semáforo que te dice si es momento bueno o malo para consumir, y consejos
            prácticos para ahorrar en la factura.
          </p>
          <p>
            También ofrecemos <Link href="/calculadoras">calculadoras</Link> para que sepas exactamente cuánto te costará
            usar cada electrodoméstico a una hora concreta del día, comparativas entre
            coche eléctrico y gasolina, y <Link href="/guias">guías prácticas</Link> sobre el PVPC y el ahorro eléctrico.
          </p>

          <h2>De dónde vienen los datos</h2>
          <p>
            Todos los precios que ves vienen de <strong>Red Eléctrica de España (REE)</strong>,
            el operador oficial del sistema eléctrico nacional. Son los mismos datos que
            aparecen en tu factura cuando estás en el PVPC. Los datos se actualizan automáticamente
            cada hora directamente desde la API pública de REE.
          </p>
          <p>
            Si quieres saber más sobre cómo calculamos los costes, consulta nuestra <Link href="/metodologia">página de metodología</Link>.
          </p>

          <h2>Por qué es gratis</h2>
          <p>
            CuantoLuz es gratis para todo el mundo. Nos financiamos con publicidad no intrusiva
            a través de Google AdSense. Si alguna vez quieres apoyarnos, simplemente desactiva
            el bloqueador de anuncios en esta web.
          </p>

          <h2>Contacto</h2>
          <p>
            Para cualquier consulta, sugerencia o problema técnico, puedes escribirnos a{' '}
            <a href="mailto:cuantoluz@gmail.com">cuantoluz@gmail.com</a>.
          </p>
        </section>
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 17px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 24px 0 12px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 14px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
