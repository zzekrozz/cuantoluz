import type { Metadata } from 'next';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Política de Cookies',
  description: 'Política de cookies de CuantoLuz: qué cookies usamos y cómo gestionarlas.',
  path: '/politica-cookies',
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Política de Cookies', url: '/politica-cookies' },
];

export default function PoliticaCookies() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Política de Cookies</h1>
        <p className="lead">
          Qué cookies usamos en CuantoLuz, para qué y cómo gestionarlas.
        </p>

        <section className="article-content">
          <h2>¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos que se descargan en tu dispositivo al visitar una web.
            Sirven para que la web funcione correctamente, recuerde tus preferencias y nos ayude a
            entender cómo se usa.
          </p>

          <h2>Tipos de cookies que usamos</h2>

          <h3>Cookies técnicas (necesarias)</h3>
          <p>
            Imprescindibles para el funcionamiento de la web. No se pueden desactivar. Por ejemplo,
            guardamos tu preferencia de tema oscuro/claro y si has aceptado las cookies.
          </p>

          <h3>Cookies analíticas (Google Analytics)</h3>
          <p>
            Nos ayudan a entender cómo los usuarios navegan por la web de forma anónima y agregada.
            Puedes rechazarlas.
          </p>

          <h3>Cookies publicitarias (Google AdSense)</h3>
          <p>
            Permiten mostrar anuncios relevantes y medir su efectividad. Puedes rechazarlas.
          </p>

          <h2>Cómo gestionar las cookies</h2>
          <p>
            Cuando entras por primera vez en CuantoLuz, te aparece un banner donde puedes aceptar
            o rechazar las cookies no esenciales.
          </p>
          <p>
            También puedes gestionarlas desde la configuración de tu navegador:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Ajustes → Privacidad y seguridad → Cookies</li>
            <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad</li>
            <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
          </ul>

          <h2>Cookies de terceros</h2>
          <p>Esta web puede contener cookies de terceros como:</p>
          <ul>
            <li>
              <strong>Google Analytics:</strong>{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                política de privacidad
              </a>
            </li>
            <li>
              <strong>Google AdSense:</strong>{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                política de privacidad
              </a>
            </li>
          </ul>
        </section>
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 16px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; margin: 24px 0 10px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin: 16px 0 8px; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 12px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        .article-content ul { margin: 12px 0; padding-left: 22px; }
        .article-content li { margin-bottom: 6px; line-height: 1.7; color: var(--text-soft); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
