import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';
import MejorHoraLavadoraWidget from './MejorHoraLavadoraWidget';

export const metadata: Metadata = buildMetadata({
  title: 'Mejor hora para poner la lavadora hoy | Dato actualizado',
  description: 'La mejor hora para poner la lavadora hoy en España según el precio del PVPC actualizado. Calcula cuánto ahorras vs ponerla en hora cara.',
  path: '/electrodomesticos/mejor-hora-poner-lavadora',
  keywords: ['mejor hora poner lavadora', 'mejor hora lavadora hoy', 'cuando poner lavadora', 'hora valle lavadora'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Electrodomésticos', url: '/electrodomesticos' },
  { name: 'Mejor hora para poner la lavadora', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
];

export default function MejorHoraLavadoraPage() {
  const articleSchema = buildArticleSchema({
    headline: 'Mejor hora para poner la lavadora hoy',
    description: 'Análisis diario con el dato actualizado del PVPC.',
    url: '/electrodomesticos/mejor-hora-poner-lavadora',
    datePublished: new Date().toISOString(),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(articleSchema)} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Mejor hora para poner la lavadora hoy</h1>
        <p className="lead">
          La mejor hora cambia cada día según el precio del PVPC. Aquí te mostramos en directo cuál es la mejor hora hoy, con datos actualizados de Red Eléctrica de España.
        </p>

        {/* WIDGET CON DATO VIVO - el diferenciador clave */}
        <MejorHoraLavadoraWidget />

        <section className="article-content">
          <h2>¿Por qué la mejor hora cambia cada día?</h2>
          <p>
            El precio de la luz en España no es fijo: depende de la <strong>demanda</strong>, la <strong>generación renovable</strong> (solar, eólica) y otros factores que cambian cada hora. En primavera y verano, las horas con sol fuerte (12:00-17:00) suelen ser baratas porque hay mucha energía solar. En invierno, las baratas suelen ser de madrugada.
          </p>
          <p>
            Por eso es <strong>peligroso fiarse de generalizaciones</strong> como "pon la lavadora siempre de madrugada". A veces, hoy mismo, la madrugada puede ser cara y la sobremesa muy barata. Lo único que funciona es mirar el dato real del día.
          </p>

          <h2>¿Cuánto se ahorra realmente?</h2>
          <p>
            La diferencia entre poner la lavadora en la mejor o en la peor hora puede ser de <strong>10 a 25 céntimos por lavado</strong>. Si lavas 4-5 veces por semana, son <strong>30-60€ al año</strong> solo por elegir bien la hora. No es la cantidad que cambia tu vida, pero es el tipo de hábito que multiplicado por todos tus electrodomésticos sí marca una diferencia notable en la factura.
          </p>

          <h2>Cómo poner la lavadora a la hora barata sin estar pendiente</h2>
          <p>
            La mayoría de lavadoras modernas tienen <strong>inicio diferido</strong>: cargas la ropa por la noche y programas que empiece a las 3 de la mañana. Si tu lavadora no lo tiene, puedes usar un <strong>enchufe inteligente</strong> con temporizador (cuestan unos 10-15€) y conseguir el mismo efecto.
          </p>
          <p>
            Importante: no dejes la lavadora funcionando si no estás en casa durante mucho tiempo. Lo ideal es que termine justo antes de levantarte o de volver a casa.
          </p>

          <h2>Para saber más</h2>
          <p>
            Si quieres calcular el coste exacto de tu lavadora según el programa y la hora, usa la <Link href="/calculadoras/lavadora">calculadora de lavadora</Link>. Y si quieres ver el precio de la luz hora a hora, en la <Link href="/">página principal</Link> tienes todo el detalle.
          </p>
        </section>

        <RelatedLinks links={[
          { title: 'Calculadora de lavadora', description: 'Calcula el coste exacto de cada lavado.', url: '/calculadoras/lavadora' },
          { title: 'Cuánto cuesta poner una lavadora', description: 'Guía completa con costes reales.', url: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora' },
          { title: 'Programa Eco 40-60', description: 'El programa más eficiente.', url: '/electrodomesticos/programa-eco-40-60' },
          { title: 'Precio de la luz mañana', description: 'Planifica tus lavados.', url: '/precio-luz-manana' },
        ]} />
      </article>

      <style>{`
        .article-page h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 38px); font-weight: 800; margin: 8px 0 12px; letter-spacing: -0.5px; line-height: 1.2; }
        .article-page .lead { font-size: 16px; color: var(--text-soft); margin-bottom: 28px; line-height: 1.6; }
        .article-content { margin-top: 40px; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .article-content h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin: 24px 0 12px; }
        .article-content h2:first-child { margin-top: 0; }
        .article-content p { color: var(--text-soft); line-height: 1.7; margin-bottom: 14px; }
        .article-content strong { color: var(--text); font-weight: 700; }
        .article-content a { color: var(--accent); }
        @media (max-width: 767px) { .article-content { padding: 22px 18px; } }
      `}</style>
    </>
  );
}
