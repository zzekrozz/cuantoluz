import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Qué es el PVPC? Precio Voluntario Pequeño Consumidor | CuantoLuz',
  description: 'Te explicamos qué es el PVPC, cómo funciona el precio regulado de la luz en España y por qué cambia cada hora del día.',
};

export default function QueEsPVPC() {
  return (
    <article className="article container-sm">
      <h1>¿Qué es el PVPC?</h1>
      <p className="lead">
        El PVPC son las siglas de Precio Voluntario para el Pequeño Consumidor, el precio
        regulado de la electricidad en España. Es decir, la tarifa eléctrica que fija el
        Gobierno y que cambia cada hora del día.
      </p>

      <h2>¿A quién se aplica?</h2>
      <p>
        Si tienes una potencia contratada igual o inferior a 10 kW (la mayoría de hogares),
        puedes acogerte a esta tarifa a través de una <strong>comercializadora de referencia</strong>{' '}
        como Curenergía, Energía XXI o Régsiti, entre otras.
      </p>

      <h2>¿Cómo se calcula el precio del PVPC?</h2>
      <p>
        El precio del PVPC se basa principalmente en el <strong>mercado mayorista de electricidad</strong>,
        donde productores y comercializadoras compran y venden energía. A este precio base se le suman:
      </p>
      <ul>
        <li>Los <strong>peajes y cargos</strong> del sistema eléctrico</li>
        <li>Los <strong>costes de servicios de ajuste</strong></li>
        <li>Los <strong>impuestos</strong> correspondientes (IVA, impuesto eléctrico, etc.)</li>
      </ul>
      <p>
        El resultado es el precio final por kWh que verás reflejado en tu factura.
      </p>

      <h2>¿Por qué cambia cada hora?</h2>
      <p>
        La demanda de electricidad no es la misma a las 4 de la madrugada que a las 8 de la tarde.
        Cuando hay mucha demanda y poca producción renovable, el precio sube. Cuando ocurre lo
        contrario (mucha energía solar al mediodía o eólica de madrugada), el precio baja.
      </p>

      <h2>Mercado regulado vs mercado libre</h2>
      <p>
        En España puedes elegir entre dos opciones para tu suministro eléctrico:
      </p>
      <h3>Mercado regulado (PVPC)</h3>
      <p>
        El precio cambia cada hora siguiendo el mercado mayorista. Ideal si puedes adaptar
        tu consumo a las horas baratas.
      </p>
      <h3>Mercado libre</h3>
      <p>
        Contratas con una comercializadora privada que te ofrece un precio fijo durante un
        periodo determinado. Más previsible, pero generalmente más caro a largo plazo si
        no sabes negociar.
      </p>

      <h2>¿Te conviene el PVPC?</h2>
      <p>
        <strong>Te conviene si:</strong>
      </p>
      <ul>
        <li>Puedes mover tu consumo a las horas más baratas (madrugada y mediodía)</li>
        <li>Tienes electrodomésticos programables</li>
        <li>No te importa que la factura varíe cada mes</li>
        <li>Quieres pagar lo justo según el mercado real</li>
      </ul>
      <p>
        <strong>No te conviene si:</strong>
      </p>
      <ul>
        <li>Necesitas una factura predecible</li>
        <li>Consumes principalmente en horas pico (tarde-noche)</li>
        <li>No tienes flexibilidad para programar aparatos</li>
      </ul>

      <p style={{ marginTop: '32px' }}>
        ¿Quieres ver el precio del PVPC en tiempo real?{' '}
        <a href="/">Vuelve a la página principal</a> y consulta los precios de hoy.
      </p>
    </article>
  );
}
