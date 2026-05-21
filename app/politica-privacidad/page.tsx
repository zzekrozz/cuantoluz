import type { Metadata } from 'next';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos de CuantoLuz.',
  path: '/politica-privacidad',
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Política de Privacidad', url: '/politica-privacidad' },
];

export default function PoliticaPrivacidad() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Política de Privacidad</h1>
        <p className="lead">
          En CuantoLuz respetamos tu privacidad y nos comprometemos a proteger tus datos personales.
        </p>

        <section className="article-content">
          <h2>1. Responsable del tratamiento</h2>
          <p>
            <strong>Web:</strong> cuantoluz.es<br />
            <strong>Email de contacto:</strong> cuantoluz@gmail.com
          </p>

          <h2>2. Qué datos recogemos</h2>
          <p>
            CuantoLuz es una herramienta gratuita que no requiere registro. No recogemos datos
            personales identificables como nombre, email o teléfono salvo que tú nos los proporciones
            voluntariamente (por ejemplo, al contactar con nosotros).
          </p>
          <p>Sí utilizamos:</p>
          <ul>
            <li><strong>Cookies técnicas</strong> necesarias para el funcionamiento del sitio</li>
            <li><strong>Cookies analíticas</strong> (Google Analytics) para entender cómo usan los usuarios la web</li>
            <li><strong>Cookies publicitarias</strong> (Google AdSense) para mostrar anuncios relevantes</li>
          </ul>

          <h2>3. Para qué usamos los datos</h2>
          <ul>
            <li>Mejorar el funcionamiento de la web</li>
            <li>Analizar el tráfico de forma agregada</li>
            <li>Mostrar publicidad para mantener el servicio gratuito</li>
          </ul>

          <h2>4. Publicidad y Google AdSense</h2>
          <p>
            Esta web utiliza Google AdSense para mostrar anuncios. Google puede usar cookies
            para mostrar anuncios basados en tus visitas previas a este u otros sitios web.
          </p>
          <p>
            Puedes desactivar el uso de cookies de DoubleClick visitando{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              la configuración de anuncios de Google
            </a>.
          </p>

          <h2>5. Tus derechos</h2>
          <p>De acuerdo con el RGPD, tienes derecho a:</p>
          <ul>
            <li>Acceder a tus datos</li>
            <li>Rectificarlos o suprimirlos</li>
            <li>Limitar u oponerte al tratamiento</li>
            <li>Solicitar la portabilidad</li>
            <li>Presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es)</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escribe a cuantoluz@gmail.com.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Para más información sobre las cookies que utilizamos, consulta nuestra{' '}
            <a href="/politica-cookies">Política de Cookies</a>.
          </p>

          <h2>7. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política. Cualquier cambio se publicará en esta misma página.
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
        .article-content ul { margin: 12px 0; padding-left: 22px; }
        .article-content li { margin-bottom: 6px; line-height: 1.7; color: var(--text-soft); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
