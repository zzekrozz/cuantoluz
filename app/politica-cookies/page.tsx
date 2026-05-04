import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies | CuantoLuz',
  description: 'Política de cookies de CuantoLuz: qué cookies usamos y cómo gestionarlas.',
};

export default function PoliticaCookies() {
  return (
    <article className="article container-sm">
      <h1>Política de Cookies</h1>

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
      <p>
        Esta web puede contener cookies de terceros como:
      </p>
      <ul>
        <li>
          <strong>Google Analytics:</strong>{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
            política de privacidad
          </a>
        </li>
        <li>
          <strong>Google AdSense:</strong>{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
            política de privacidad
          </a>
        </li>
      </ul>
    </article>
  );
}
