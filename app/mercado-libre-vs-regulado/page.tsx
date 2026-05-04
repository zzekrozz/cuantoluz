import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mercado libre vs PVPC: ¿qué tarifa eléctrica te conviene más? | CuantoLuz',
  description: 'Comparativa clara entre mercado libre y mercado regulado de la luz. Pros, contras y cuál te conviene según tu consumo.',
};

export default function MercadoLibreVsRegulado() {
  return (
    <article className="article container-sm">
      <h1>Mercado libre vs mercado regulado</h1>
      <p className="lead">
        En España, cualquier hogar puede elegir entre contratar la luz en el mercado regulado
        (PVPC) o en el mercado libre. La elección depende de tu perfil de consumo y de cuánto
        te importa la previsibilidad.
      </p>

      <h2>Mercado regulado (PVPC)</h2>
      <p>
        <strong>Cómo funciona:</strong> El precio cambia cada hora siguiendo el mercado mayorista.
        Lo fija el Gobierno y solo lo ofrecen las comercializadoras de referencia.
      </p>
      <p><strong>Ventajas:</strong></p>
      <ul>
        <li>Pagas el precio real del mercado, sin sobrecoste de comercializadora</li>
        <li>Ideal si puedes mover el consumo a horas baratas</li>
        <li>Sin permanencias ni letra pequeña</li>
      </ul>
      <p><strong>Desventajas:</strong></p>
      <ul>
        <li>La factura cambia mucho de un mes a otro</li>
        <li>Si consumes en horas pico, sale caro</li>
        <li>Hay que estar atento a los precios</li>
      </ul>

      <h2>Mercado libre</h2>
      <p>
        <strong>Cómo funciona:</strong> Contratas con una empresa privada que te ofrece un precio
        fijo durante un tiempo (1, 2 o 3 años habitualmente). Tú pagas siempre lo mismo por kWh.
      </p>
      <p><strong>Ventajas:</strong></p>
      <ul>
        <li>Factura predecible cada mes</li>
        <li>Ofertas con descuentos, servicios añadidos, etc.</li>
        <li>Ideal si no tienes flexibilidad de horarios</li>
      </ul>
      <p><strong>Desventajas:</strong></p>
      <ul>
        <li>El precio fijo suele ser más alto que la media del PVPC</li>
        <li>Puede haber permanencias</li>
        <li>Las ofertas a veces tienen letra pequeña complicada</li>
      </ul>

      <h2>¿Cuál te conviene?</h2>
      <p><strong>Te conviene el PVPC si:</strong></p>
      <ul>
        <li>Puedes adaptar tu consumo a las horas baratas</li>
        <li>Tienes electrodomésticos programables</li>
        <li>Has visto que tu consumo principal es de noche o mediodía</li>
        <li>No te importa que la factura varíe</li>
      </ul>
      <p><strong>Te conviene el mercado libre si:</strong></p>
      <ul>
        <li>Necesitas saber exactamente cuánto vas a pagar</li>
        <li>Consumes mucho en horas pico (tarde-noche)</li>
        <li>No quieres complicarte la vida mirando precios</li>
      </ul>

      <h2>Truco práctico</h2>
      <p>
        Antes de decidir, mira tu factura actual. Compara el precio medio que pagas por kWh
        con la media del PVPC del mes pasado (suele estar entre 12 y 18 céntimos). Si pagas
        mucho más, plantéate cambiar al PVPC. Si pagas similar o menos, el mercado libre te
        está saliendo bien.
      </p>
    </article>
  );
}
