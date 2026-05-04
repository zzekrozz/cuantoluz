import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Cuándo se publica el precio de la luz de mañana? | CuantoLuz',
  description: 'Te explicamos a qué hora se publica el precio del PVPC para el día siguiente y dónde puedes consultarlo.',
};

export default function PrecioManana() {
  return (
    <article className="article container-sm">
      <h1>¿Cuándo se publica el precio de la luz de mañana?</h1>
      <p className="lead">
        Una de las dudas más habituales es cuándo se conoce el precio de la luz para el día
        siguiente. La respuesta corta: alrededor de las 20:15 de la tarde.
      </p>

      <h2>Cómo funciona la publicación</h2>
      <p>
        Cada día, sobre las 12:00 del mediodía, se cierra la subasta del mercado mayorista
        para el día siguiente. Esos precios se procesan y, una vez añadidos los peajes y costes
        correspondientes, <strong>Red Eléctrica de España (REE)</strong> los publica oficialmente.
      </p>
      <p>
        A partir de las 20:15 ya puedes consultar:
      </p>
      <ul>
        <li>El precio hora por hora de mañana</li>
        <li>Cuál será la hora más barata</li>
        <li>Cuál será la hora más cara</li>
        <li>Si en general será un día caro o barato</li>
      </ul>

      <h2>¿Por qué es útil saberlo?</h2>
      <p>
        Conocer el precio de mañana te permite planificar:
      </p>
      <ul>
        <li>Cuándo programar la lavadora</li>
        <li>Cuándo cargar el coche eléctrico</li>
        <li>Cuándo evitar usar aire acondicionado o calefacción</li>
        <li>Si conviene esperar al día siguiente para algunas tareas</li>
      </ul>
      <p>
        Por ejemplo: si hoy hace mucho viento y mañana habrá mucho sol, los precios pueden
        bajar bastante. Saberlo de antemano te ayuda a ahorrar sin esfuerzo.
      </p>

      <h2>¿Y si quiero ver el precio en otro horario?</h2>
      <p>
        En CuantoLuz actualizamos los datos automáticamente. A partir de las 20:15 ya puedes
        ver el precio del día siguiente, y cuando entra el nuevo día se actualiza solo.
      </p>
    </article>
  );
}
