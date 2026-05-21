import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';

export const metadata: Metadata = buildMetadata({
  title: 'Programa Eco 40-60 de la lavadora | Qué es y por qué es el más eficiente',
  description: 'El programa Eco 40-60 es el referente oficial de eficiencia en lavadoras según la UE. Te explicamos cómo funciona, por qué tarda más y cuánto ahorras.',
  path: '/electrodomesticos/programa-eco-40-60',
  keywords: ['programa eco 40-60', 'eco 40-60 lavadora', 'lavadora programa eco', 'programa lavadora más eficiente'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
  { name: 'Programa Eco 40-60', url: '/electrodomesticos/programa-eco-40-60' },
];

export default function ProgramaEcoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Programa Eco 40-60 de la lavadora',
        description: 'Qué es, cómo funciona y por qué es el programa más eficiente.',
        url: '/electrodomesticos/programa-eco-40-60',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Programa Eco 40-60: qué es y por qué es el más eficiente</h1>
        <p className="lead">
          El programa <strong>Eco 40-60</strong> es el estándar oficial de la UE para medir la eficiencia de las lavadoras. Tarda más, sí, pero consume menos. Te explicamos cómo funciona.
        </p>

        <section className="article-content">
          <h2>¿Qué es el programa Eco 40-60?</h2>
          <p>
            Desde 2021, la normativa europea exige que todas las lavadoras tengan un programa llamado <strong>Eco 40-60</strong>. Es el programa que se usa para hacer las pruebas de la etiqueta energética, así que es el más optimizado en consumo de cada modelo.
          </p>
          <p>
            Está pensado para lavar ropa de algodón "normalmente sucia" a 40°C o 60°C, pero ojo: la máquina <strong>no calienta el agua hasta esa temperatura</strong>. La calienta a una temperatura más baja (típicamente 25-35°C) y la mantiene más tiempo en contacto con la ropa. Con detergentes modernos, esto limpia igual de bien.
          </p>

          <h2>¿Por qué tarda tanto?</h2>
          <p>
            Un programa Eco 40-60 puede tardar entre <strong>3 y 4 horas</strong>, mucho más que un programa rápido de 30 minutos. La razón es sencilla: <strong>calentar el agua es lo que más gasta</strong> en una lavadora. Si en lugar de subir mucho la temperatura, mantienes una más baja durante más rato, el resultado es similar pero gastas mucho menos.
          </p>

          <h2>¿Cuánto se ahorra?</h2>
          <p>
            Comparado con un programa estándar a 40°C, el Eco 40-60 ahorra entre un <strong>20% y un 40%</strong> de electricidad. Comparado con uno a 60°C, el ahorro puede llegar al <strong>50%</strong>. Y comparado con un "rápido 30 min", la diferencia depende del modelo, pero suele ser entre un <strong>15% y 30% menos</strong>.
          </p>
          <p>
            En euros: si una lavadora estándar te cuesta 12 céntimos, en Eco te puede costar 7-8. Multiplicado por 4-5 lavados a la semana, son <strong>15-20€ al año</strong>.
          </p>

          <h2>¿Y los inconvenientes?</h2>
          <p>
            Los hay. El principal es el <strong>tiempo</strong>: si tienes prisa, el Eco 40-60 no te sirve. El segundo es que no quita manchas muy difíciles igual de bien que un programa caliente. Si tienes manchas de grasa, sangre o vino, lo mejor es prelavar o usar un programa a 60°C puntualmente.
          </p>
          <p>
            También: si la ropa lleva mucho tiempo guardada y huele, conviene un ciclo más caliente para matar bacterias. Para el resto, Eco siempre.
          </p>

          <h2>Combinación ganadora</h2>
          <p>
            La fórmula que más ahorra es <strong>Eco 40-60 + horario barato</strong>. Cuando juntas las dos cosas, una lavadora puede salirte por 4-5 céntimos en lugar de los 15-20 céntimos habituales. Usa la <Link href="/calculadoras/lavadora">calculadora de lavadora</Link> para verlo con tu caso.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Calculadora de lavadora', description: 'Calcula tu coste según el programa.', url: '/calculadoras/lavadora' },
          { title: 'Mejor hora para poner la lavadora HOY', description: 'Dato vivo actualizado.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
          { title: 'Cuánto consume una lavadora', description: 'Consumo por programa.', url: '/electrodomesticos/cuanto-consume-una-lavadora' },
          { title: 'Cómo ahorrar luz en casa', description: 'Más trucos.', url: '/guias/como-ahorrar-luz-en-casa' },
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
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
