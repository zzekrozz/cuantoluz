import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | CuantoLuz',
  description: 'Política de privacidad y protección de datos de CuantoLuz.',
};

export default function PoliticaPrivacidad() {
  return (
    <article className="article container-sm">
      <h1>Política de Privacidad</h1>
      <p className="lead">
        En CuantoLuz respetamos tu privacidad y nos comprometemos a proteger tus datos personales.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        <strong>Web:</strong> cuantoluz.es<br />
        <strong>Email de contacto:</strong> contacto@cuantoluz.es
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
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">
          la configuración de anuncios de Google
        </a>.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        De acuerdo con el RGPD, tienes derecho a:
      </p>
      <ul>
        <li>Acceder a tus datos</li>
        <li>Rectificarlos o suprimirlos</li>
        <li>Limitar u oponerte al tratamiento</li>
        <li>Solicitar la portabilidad</li>
        <li>Presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es)</li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, escribe a contacto@cuantoluz.es.
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
    </article>
  );
}
