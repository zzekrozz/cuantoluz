import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre CuantoLuz | Web del precio de la luz en España',
  description: 'CuantoLuz es una herramienta gratuita que muestra el precio de la luz hora a hora en España con datos oficiales de Red Eléctrica.',
};

export default function Sobre() {
  return (
    <article className="article container-sm">
      <h1>Sobre CuantoLuz</h1>
      <p className="lead">
        CuantoLuz nació para que cualquier persona pueda saber, en 5 segundos, cuándo conviene
        encender la lavadora. Sin gráficos confusos, sin webs feas, sin tener que buscar
        en la página oficial del Gobierno.
      </p>

      <h2>Qué hacemos</h2>
      <p>
        Mostramos el precio de la luz en España hora a hora, con un diseño claro,
        un semáforo que te dice si es momento bueno o malo para consumir, y consejos
        prácticos para ahorrar en la factura.
      </p>
      <p>
        También ofrecemos calculadoras para que sepas exactamente cuánto te costará
        usar cada electrodoméstico a una hora concreta del día, comparativas entre
        coche eléctrico y gasolina, y mucho más.
      </p>

      <h2>De dónde vienen los datos</h2>
      <p>
        Todos los precios que ves vienen de <strong>Red Eléctrica de España (REE)</strong>,
        el operador oficial del sistema eléctrico nacional. Son los mismos datos que
        aparecen en tu factura cuando estás en el PVPC. Los datos se actualizan automáticamente
        cada hora directamente desde la API pública de REE.
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
        <a href="mailto:contacto@cuantoluz.es">contacto@cuantoluz.es</a>.
      </p>
    </article>
  );
}
