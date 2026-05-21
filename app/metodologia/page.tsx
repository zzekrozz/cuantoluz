import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Database, Calculator, RefreshCw, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Metodología | Cómo calcula CuantoLuz los precios y consumos',
  description: 'De dónde sacamos los precios del PVPC, cómo calculamos el coste de cada electrodoméstico y qué supuestos usamos en nuestras calculadoras.',
  path: '/metodologia',
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Metodología', url: '/metodologia' },
];

export default function MetodologiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Metodología</h1>
        <p className="lead">
          Transparencia total sobre <strong>de dónde sacamos los datos</strong>, <strong>cómo calculamos los costes</strong> y <strong>qué supuestos usamos</strong> en cada calculadora.
        </p>

        <section className="article-content">
          <h2><Database size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Fuente de los datos</h2>
          <p>
            Todos los precios del PVPC mostrados en CuantoLuz proceden directamente de <strong>Red Eléctrica de España (REE)</strong>, el operador del sistema eléctrico nacional. Usamos su <strong>API pública oficial</strong>, sin intermediarios ni manipulaciones.
          </p>
          <p>
            El indicador concreto es el <strong>"PVPC peaje por defecto (2.0TD)"</strong>, que corresponde a la tarifa regulada más habitual en hogares con potencia inferior a 10 kW. Es el mismo dato que usan Iberdrola, Naturgy y el resto de comercializadoras de referencia.
          </p>

          <h2><RefreshCw size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Frecuencia de actualización</h2>
          <ul>
            <li><strong>Precios de hoy:</strong> disponibles desde las 00:00 del propio día</li>
            <li><strong>Precios de mañana:</strong> publicados a partir de las 20:15h del día anterior</li>
            <li><strong>Refresco en cada visita:</strong> al cargar cualquier página, consultamos directamente la API de REE para garantizar el dato más actualizado</li>
          </ul>

          <h2><Calculator size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Cómo calculamos los costes</h2>
          <p>
            La fórmula base es simple: <strong>consumo (kWh) × precio horario (€/kWh) = coste</strong>. Para electrodomésticos que duran más de una hora (como la lavadora), distribuimos el consumo total entre las horas que dura el ciclo, ponderando por cada precio horario correspondiente.
          </p>
          <p>
            Esto significa que si pones una lavadora de 0,8 kWh con duración de 2 horas a las 14:30, calculamos:
          </p>
          <ul>
            <li>0,2 kWh en la hora 14:00-15:00 (a su precio)</li>
            <li>0,4 kWh en la hora 15:00-16:00 (a su precio)</li>
            <li>0,2 kWh en la hora 16:00-17:00 (a su precio)</li>
          </ul>
          <p>
            Y los sumamos. Es el cálculo más fiel posible.
          </p>

          <h2>Consumos de electrodomésticos</h2>
          <p>
            Los consumos en kWh por programa que usamos vienen de las <strong>etiquetas energéticas oficiales</strong> y de mediciones independientes publicadas por la OCU y otras organizaciones de consumidores. Son <strong>valores medios</strong> de aparatos modernos (post-2021) en las distintas clases energéticas.
          </p>
          <p>
            Tu aparato concreto puede consumir algo más o algo menos según su modelo, antigüedad y estado. Por eso muchas calculadoras te permiten elegir la <strong>clase de eficiencia</strong>, que ajusta el cálculo.
          </p>

          <h2>Precios de referencia para comparativas</h2>
          <ul>
            <li><strong>Carga rápida coche eléctrico:</strong> 0,45€/kWh (precio medio de redes públicas en España, 2026)</li>
            <li><strong>Gasolina:</strong> 1,55€/litro (precio medio España, 2026)</li>
            <li><strong>Consumo medio coche gasolina:</strong> 6,5 litros/100 km</li>
          </ul>
          <p>
            Estos valores se actualizan periódicamente cuando las referencias del mercado cambian de forma significativa.
          </p>

          <h2><ShieldCheck size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Lo que NO incluimos</h2>
          <p>
            Para evitar confusión, los cálculos que mostramos son <strong>solo del coste del kWh</strong>. <strong>No incluyen</strong>:
          </p>
          <ul>
            <li>El término de potencia (lo que pagas por tener X kW contratados)</li>
            <li>Impuestos (IVA, impuesto eléctrico)</li>
            <li>El alquiler del contador</li>
            <li>Bono social, deducciones puntuales</li>
          </ul>
          <p>
            Esto es porque esos costes son <strong>fijos al mes</strong>, no dependen de cuándo consumas. Para el objetivo de la web —ayudarte a decidir <strong>cuándo</strong> consumir— solo la parte variable del kWh es relevante.
          </p>
          <p>
            Si quieres el coste total incluyendo impuestos, multiplica los céntimos mostrados por <strong>1,21</strong> (IVA) y suma el impuesto eléctrico.
          </p>

          <h2>Margen de error</h2>
          <p>
            Los precios del PVPC son <strong>exactos</strong> (vienen directamente de REE). Los consumos de electrodomésticos son <strong>estimaciones medias</strong> con un margen del ±10-15% respecto a tu aparato concreto. Para mayor precisión, te recomendamos medir con un <strong>medidor de consumo enchufable</strong>.
          </p>

          <h2>Contacto</h2>
          <p>
            Si detectas algún error o tienes sugerencias para mejorar nuestros cálculos, escríbenos a <strong>cuantoluz@gmail.com</strong>. Revisamos toda la metodología cuando recibimos feedback fundamentado.
          </p>
        </section>
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 17px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-page .lead strong { color: var(--text); font-weight: 700; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 28px 0 12px; display: flex; align-items: center; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 14px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        .article-content ul { margin: 14px 0; padding-left: 22px; }
        .article-content li { margin-bottom: 8px; line-height: 1.7; color: var(--text-soft); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
