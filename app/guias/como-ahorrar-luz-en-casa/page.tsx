import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedLinks from '@/components/RelatedLinks';

export const metadata: Metadata = buildMetadata({
  title: 'Cómo ahorrar luz en casa | 15 trucos que sí funcionan',
  description: 'Trucos prácticos y realistas para reducir tu factura de la luz: en electrodomésticos, climatización, iluminación y cómo aprovechar las horas baratas.',
  path: '/guias/como-ahorrar-luz-en-casa',
  keywords: ['como ahorrar luz', 'ahorrar electricidad casa', 'reducir factura luz', 'trucos ahorrar luz'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Guías', url: '/guias' },
  { name: 'Cómo ahorrar luz en casa', url: '/guias/como-ahorrar-luz-en-casa' },
];

export default function ComoAhorrarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildArticleSchema({
        headline: 'Cómo ahorrar luz en casa',
        description: 'Trucos prácticos y realistas para reducir la factura.',
        url: '/guias/como-ahorrar-luz-en-casa',
        datePublished: '2026-05-01',
      }))} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="article-page">
        <h1>Cómo ahorrar luz en casa: trucos que sí funcionan</h1>
        <p className="lead">
          La factura de la luz se puede reducir un <strong>20-30%</strong> sin renunciar a comodidad. Aquí no hay milagros ni venta de productos: solo hábitos y trucos que sí funcionan.
        </p>

        <section className="article-content">
          <h2>Lo que más impacto tiene (el 80/20)</h2>
          <p>
            Si solo vas a cambiar tres cosas, que sean estas:
          </p>
          <ol>
            <li><strong>Pon los aparatos grandes en horas baratas:</strong> lavadora, lavavajillas, secadora, plancha. Diferencia: 30-50% más barato. Ahorro al año: 30-80€.</li>
            <li><strong>Ajusta la temperatura de la climatización:</strong> aire a 24-26°C en verano, calefacción a 19-21°C en invierno. Cada grado son 6-8% más. Ahorro al año: 50-150€.</li>
            <li><strong>Apaga el "vampiro eléctrico":</strong> el standby de televisores, decodificadores, ordenadores, cargadores. Una regleta con interruptor para todo eso. Ahorro al año: 30-50€.</li>
          </ol>

          <h2>Aprovechar las horas baratas del PVPC</h2>
          <p>
            Si tienes el PVPC, mira el <Link href="/">precio de la luz hoy</Link> antes de poner aparatos que consumen mucho. La diferencia entre la peor y la mejor hora puede ser del <strong>50% o más</strong>.
          </p>
          <p>
            Para hacerlo sin estar pendiente:
          </p>
          <ul>
            <li>Usa el <strong>inicio diferido</strong> de la lavadora y el lavavajillas</li>
            <li>Programa la carga del <strong>coche eléctrico</strong> en madrugada</li>
            <li>Usa <strong>enchufes inteligentes</strong> con horario (10-15€) para aparatos viejos</li>
            <li>Plancha por la <strong>mañana temprano o sobremesa</strong>, no por la noche</li>
          </ul>

          <h2>Lavadora y lavavajillas</h2>
          <ul>
            <li>Usa siempre el <strong>programa Eco 40-60</strong> (lavadora) o <strong>Eco</strong> (lavavajillas) salvo casos puntuales</li>
            <li><strong>Llena los aparatos</strong> antes de ponerlos; medio cargados gastan casi lo mismo</li>
            <li>Lava con <strong>agua fría</strong> la ropa poco sucia</li>
            <li>No prelaves a mano los platos: el lavavajillas ya hace su trabajo</li>
          </ul>

          <h2>Aire acondicionado y calefacción</h2>
          <ul>
            <li>Verano: <strong>24-26°C</strong>. Combinado con un ventilador, sientes lo mismo</li>
            <li>Invierno: <strong>19-21°C</strong> es lo recomendado. Por la noche, baja a 17°C</li>
            <li>Cierra persianas en horas de sol en verano, ábrelas en invierno</li>
            <li>Limpia los <strong>filtros del aire</strong> una vez al mes</li>
            <li>Si vas a estar fuera más de 2 horas, apágalo todo</li>
            <li>Sella ranuras de puertas y ventanas (10€ en cualquier ferretería)</li>
          </ul>

          <h2>Iluminación</h2>
          <ul>
            <li>Cambia todas las bombillas por <strong>LED</strong>. Consumen 80% menos que las antiguas</li>
            <li>No las dejes encendidas en habitaciones vacías (obvio, pero pasa)</li>
            <li>Aprovecha la <strong>luz natural</strong> al máximo</li>
          </ul>

          <h2>Frigorífico y congelador</h2>
          <ul>
            <li>Temperatura ideal: <strong>4°C en frigorífico, -18°C en congelador</strong></li>
            <li>No metas comida caliente: caliéntalo gastando más</li>
            <li><strong>Descongela</strong> cada 6 meses si tiene hielo (cada cm de hielo aumenta consumo 10%)</li>
            <li>Coloca el frigorífico <strong>lejos del horno</strong> y con espacio detrás para ventilación</li>
          </ul>

          <h2>Horno y cocina</h2>
          <ul>
            <li>Usa el <strong>microondas</strong> para calentar (consume 10x menos que el horno)</li>
            <li>Tapa las cazuelas: <strong>30% menos</strong> de tiempo de cocción</li>
            <li>Apaga el <strong>horno</strong> 5-10 minutos antes de terminar (sigue caliente)</li>
            <li>Usa olla express cuando puedas</li>
          </ul>

          <h2>Agua caliente</h2>
          <ul>
            <li>Si tienes <strong>termo eléctrico</strong>, prográmalo solo para las horas que uses agua caliente</li>
            <li>Ducha en lugar de baño (10x menos agua)</li>
            <li>Pon <strong>perlizadores</strong> en grifos y ducha (10€)</li>
            <li>Aislante en tuberías de agua caliente</li>
          </ul>

          <h2>Lo que NO funciona (mitos)</h2>
          <ul>
            <li><strong>"Encender una bombilla gasta mucho":</strong> falso, el pico es despreciable</li>
            <li><strong>"Hay que descongelar la nevera apagándola toda la noche":</strong> falso, baja la temperatura y luego gasta más</li>
            <li><strong>"El stand-by no consume":</strong> sí consume, entre 5 y 15€ al año por aparato</li>
            <li><strong>"Las bombillas de bajo consumo (CFL) gastan al encenderlas más que toda la hora":</strong> falso, el pico es de 1-2 segundos</li>
          </ul>

          <h2>Calcula tu ahorro real</h2>
          <p>
            Usa nuestras calculadoras para ver el impacto de cada cambio:
          </p>
          <ul>
            <li><Link href="/calculadoras/lavadora">Calculadora de lavadora</Link></li>
            <li><Link href="/calculadoras/aire-acondicionado">Calculadora de aire acondicionado</Link></li>
            <li><Link href="/calculadoras/consumo-electrico">Calculadora de consumo general</Link></li>
          </ul>
        </section>

        <RelatedLinks links={[
          { title: 'Precio de la luz hoy', description: 'Identifica las horas baratas.', url: '/' },
          { title: 'Qué electrodomésticos consumen más', description: 'Sabe por dónde empezar.', url: '/guias/que-electrodomesticos-consumen-mas' },
          { title: '¿Qué es el PVPC?', description: 'Aprovéchalo bien.', url: '/guias/que-es-pvpc' },
          { title: 'Mejor hora para poner la lavadora HOY', description: 'Dato vivo.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
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
