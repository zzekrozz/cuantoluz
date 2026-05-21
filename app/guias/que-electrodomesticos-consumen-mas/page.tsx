import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';

export const metadata: Metadata = buildMetadata({
  title: 'Qué electrodomésticos consumen más | Ranking y datos reales',
  description: 'Ranking de los electrodomésticos que más electricidad consumen en una casa española. Datos reales en kWh y cuánto cuestan al año.',
  path: '/guias/que-electrodomesticos-consumen-mas',
  keywords: ['electrodomesticos consumen mas', 'que consume mas electricidad casa', 'ranking consumo electrodomesticos'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Guías', url: '/guias' },
  { name: 'Qué electrodomésticos consumen más', url: '/guias/que-electrodomesticos-consumen-mas' },
];

export default function QueElectrodomesticosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Qué electrodomésticos consumen más',
        description: 'Ranking de consumo eléctrico en el hogar.',
        url: '/guias/que-electrodomesticos-consumen-mas',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Qué electrodomésticos consumen más en una casa</h1>
        <p className="lead">
          La <strong>climatización</strong> y el <strong>frigorífico</strong> son los que más electricidad consumen al año, no los aparatos que sientes "gastones" cuando los usas. Te explicamos el ranking real.
        </p>

        <section className="article-content">
          <h2>Ranking: los que más gastan al año</h2>
          <p>
            Estos son los grandes consumidores en una vivienda española típica:
          </p>
          <ol>
            <li>
              <strong>Climatización (aire acondicionado + calefacción eléctrica):</strong> 800-2.500 kWh/año
              <br />Cuesta: <strong>120-375€/año</strong>
            </li>
            <li>
              <strong>Frigorífico:</strong> 250-450 kWh/año
              <br />Cuesta: <strong>37-67€/año</strong> (¡pero está encendido las 24h!)
            </li>
            <li>
              <strong>Acumulador o termo eléctrico de agua caliente:</strong> 800-1.800 kWh/año
              <br />Cuesta: <strong>120-270€/año</strong> si lo tienes (no todos)
            </li>
            <li>
              <strong>Lavadora:</strong> 130-280 kWh/año (4-5 ciclos/semana)
              <br />Cuesta: <strong>20-42€/año</strong>
            </li>
            <li>
              <strong>Lavavajillas:</strong> 200-350 kWh/año (5-6 ciclos/semana)
              <br />Cuesta: <strong>30-52€/año</strong>
            </li>
            <li>
              <strong>Horno eléctrico:</strong> 50-200 kWh/año (uso medio)
              <br />Cuesta: <strong>7-30€/año</strong>
            </li>
            <li>
              <strong>Vitrocerámica/inducción:</strong> 200-500 kWh/año
              <br />Cuesta: <strong>30-75€/año</strong>
            </li>
            <li>
              <strong>Televisor y aparatos de ocio:</strong> 100-300 kWh/año
              <br />Cuesta: <strong>15-45€/año</strong>
            </li>
            <li>
              <strong>Iluminación (toda la casa con LED):</strong> 100-300 kWh/año
              <br />Cuesta: <strong>15-45€/año</strong>
            </li>
            <li>
              <strong>Stand-by (vampiro eléctrico):</strong> 200-400 kWh/año
              <br />Cuesta: <strong>30-60€/año</strong>
            </li>
          </ol>

          <h2>Datos en perspectiva</h2>
          <p>
            Una <strong>vivienda media española</strong> consume entre <strong>2.500 y 4.000 kWh al año</strong>. Si tu factura es muy superior, probablemente tienes climatización eléctrica intensiva o un termo eléctrico antiguo.
          </p>

          <h2>El que sientes que gasta mucho vs el que gasta mucho</h2>
          <p>
            Curiosidad: los aparatos que <strong>sientes</strong> que gastan mucho (secador, plancha, microondas, batidora) <strong>no son los principales</strong>. Gastan muchos vatios pero se usan poco tiempo. La plancha 5 minutos al día, el secador 2 minutos. En cambio:
          </p>
          <ul>
            <li>El frigorífico está <strong>las 24 horas</strong> funcionando aunque a baja potencia</li>
            <li>El aire acondicionado se usa <strong>muchas horas seguidas</strong> en verano</li>
            <li>El termo eléctrico mantiene el agua caliente <strong>siempre</strong></li>
          </ul>
          <p>
            La fórmula no es "vatios", sino <strong>"vatios × horas al año"</strong>.
          </p>

          <h2>Potencia (W) vs consumo (kWh) — la diferencia clave</h2>
          <p>
            La <strong>potencia (vatios o W)</strong> es lo que el aparato "tira" del enchufe cuando está encendido. El <strong>consumo (kWh)</strong> es la energía total usada en el tiempo. Un aparato puede tener 2000 W de potencia y gastar menos al año que uno de 200 W si lo usas menos tiempo.
          </p>
          <p>
            Como referencia, un kWh es <strong>1000 W durante 1 hora</strong>, o <strong>100 W durante 10 horas</strong>, o <strong>2000 W durante 30 minutos</strong>. Todo es lo mismo.
          </p>

          <h2>Cómo identificar tus "gastones"</h2>
          <p>
            Lo más útil es <strong>medirlos</strong>. Un medidor de consumo enchufable cuesta 10-15€ en cualquier tienda online. Lo enchufas entre la pared y el aparato y te dice cuánto consume.
          </p>
          <p>
            También puedes usar la <Link href="/calculadoras/consumo-electrico">calculadora de consumo eléctrico</Link> para estimar el coste anual de cualquier aparato con su potencia y horas de uso.
          </p>

          <h2>Estrategia: por dónde empezar</h2>
          <p>
            Si quieres reducir tu factura, ataca por orden:
          </p>
          <ol>
            <li><strong>Climatización:</strong> ajusta temperaturas, sella ventanas. Ahorro potencial: 50-150€/año</li>
            <li><strong>Termo eléctrico:</strong> prográmalo por horario. Si es antiguo, considera cambiarlo. Ahorro: 30-100€/año</li>
            <li><strong>Mover los aparatos grandes a horas baratas:</strong> Ahorro: 30-80€/año</li>
            <li><strong>Eliminar el stand-by:</strong> regletas con interruptor. Ahorro: 30-50€/año</li>
            <li><strong>Cambiar bombillas a LED si no lo has hecho:</strong> amortizas en 1-2 años</li>
          </ol>
        </section>

        <RelatedLinks links={[
          { title: 'Cómo ahorrar luz en casa', description: 'Trucos prácticos.', url: '/guias/como-ahorrar-luz-en-casa' },
          { title: 'Calculadora de consumo eléctrico', description: 'Mide tus aparatos.', url: '/calculadoras/consumo-electrico' },
          { title: 'Cuánto consume un aire acondicionado', description: 'Análisis detallado.', url: '/electrodomesticos/cuanto-consume-un-aire-acondicionado' },
          { title: 'Cuánto consume una lavadora', description: 'Análisis detallado.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
        ]} />
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 17px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.6; }
        .article-page .lead strong { color: var(--text); font-weight: 700; }
        .article-content { margin-top: 32px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 28px 0 12px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 14px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        .article-content ul, .article-content ol { margin: 14px 0; padding-left: 22px; }
        .article-content li { margin-bottom: 8px; line-height: 1.7; color: var(--text-soft); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
