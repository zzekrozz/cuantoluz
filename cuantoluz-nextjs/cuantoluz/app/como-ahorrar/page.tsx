import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo ahorrar en la factura de la luz: 10 trucos reales | CuantoLuz',
  description: 'Trucos prácticos y fáciles para reducir tu factura de la luz hasta un 30%. Sin gastar dinero ni cambiar de compañía.',
};

export default function ComoAhorrar() {
  return (
    <article className="article container-sm">
      <h1>Cómo ahorrar en la factura de la luz</h1>
      <p className="lead">
        Te vamos a contar los trucos que realmente funcionan. Sin venderte humo, sin pedirte
        que cambies de compañía, sin instalar nada caro.
      </p>

      <h2>1. Consulta el precio antes de poner cosas grandes</h2>
      <p>
        La diferencia entre la hora más barata y la más cara puede ser de hasta el 80% en un
        mismo día. Si pones la lavadora a las 3 de la madrugada en lugar de a las 8 de la tarde,
        puedes pagar 4 veces menos por el mismo lavado.
      </p>
      <p>
        Consulta cada día el precio en CuantoLuz y programa los aparatos grandes en las horas baratas.
      </p>

      <h2>2. Usa el programador de tus electrodomésticos</h2>
      <p>
        Casi todas las lavadoras, lavavajillas y secadoras modernas tienen un botón de programación
        con retraso. Pones la ropa por la noche, le dices que arranque a las 3, y a la mañana
        siguiente está lista.
      </p>
      <p>
        Si tu aparato no lo trae, un enchufe con temporizador cuesta menos de 10 euros y hace lo mismo.
      </p>

      <h2>3. Termo eléctrico solo de noche</h2>
      <p>
        Si tienes termo eléctrico (acumulador), es uno de los mayores gastos del hogar. Programa
        para que solo caliente agua entre las 2 y las 6 de la madrugada. El agua se mantiene
        caliente todo el día y ahorrarás muchísimo.
      </p>

      <h2>4. Coche eléctrico siempre por la noche</h2>
      <p>
        Si tienes coche eléctrico, no lo cargues nunca al llegar a casa. Programa la carga
        entre las 0:00 y las 7:00. La diferencia anual puede superar los 500 euros.
      </p>

      <h2>5. Revisa tu potencia contratada</h2>
      <p>
        Mucha gente paga por más potencia (kW) de la que realmente necesita. Si nunca saltan
        los plomos, probablemente puedes bajar la potencia contratada y ahorrar entre 5 y 15
        euros al mes solo en el término fijo.
      </p>

      <h2>6. Aire acondicionado a 24 grados</h2>
      <p>
        Cada grado por debajo aumenta el consumo aproximadamente un 8%. Si lo pones a 21
        en lugar de a 24, estás pagando casi un 25% más.
      </p>

      <h2>7. Calefacción a 20 grados máximo</h2>
      <p>
        Lo mismo en invierno. Cada grado por encima dispara la factura. 20 grados es
        temperatura confortable y eficiente.
      </p>

      <h2>8. Frigorífico a la temperatura correcta</h2>
      <p>
        Frigorífico a 5°C y congelador a -18°C son las temperaturas óptimas. Más frío de
        eso solo gasta más sin aportar nada.
      </p>

      <h2>9. Apaga el modo standby</h2>
      <p>
        La televisión, el router, el microondas, el ordenador... todos consumen aunque
        estén apagados. Una regleta con interruptor te ayuda a cortar todo el consumo
        fantasma cuando no lo usas. Puede suponer un 7-10% de tu factura.
      </p>

      <h2>10. Aprovecha los días de viento y sol</h2>
      <p>
        Mira la previsión del tiempo. Los días con mucho viento o mucho sol los precios
        eléctricos suelen bajar. Aprovecha esos días para hacer coladas grandes, cargar
        el coche o llenar el termo.
      </p>

      <h2>Cuánto puedes ahorrar realmente</h2>
      <p>
        Aplicando todos estos consejos, una familia media puede ahorrar entre 200 y 600 euros
        al año en electricidad sin renunciar a nada. Solo cambiando cuándo y cómo se usan los aparatos.
      </p>
    </article>
  );
}
