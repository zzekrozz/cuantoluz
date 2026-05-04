import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal | CuantoLuz',
  description: 'Aviso legal y términos de uso de CuantoLuz.',
};

export default function AvisoLegal() {
  return (
    <article className="article container-sm">
      <h1>Aviso Legal</h1>

      <h2>Datos identificativos</h2>
      <p>
        <strong>Web:</strong> cuantoluz.es<br />
        <strong>Email:</strong> contacto@cuantoluz.es
      </p>

      <h2>Objeto</h2>
      <p>
        CuantoLuz.es es una web informativa que muestra el precio de la electricidad en España
        a través de datos públicos de Red Eléctrica de España (REE). El servicio es gratuito y
        se ofrece tal cual, sin garantías de ningún tipo.
      </p>

      <h2>Exactitud de la información</h2>
      <p>
        Los precios mostrados se obtienen de fuentes oficiales (REE, ESIOS) pero pueden contener
        errores o desfases. CuantoLuz no se hace responsable de decisiones tomadas en base a la
        información mostrada.
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
    </article>
  );
}
