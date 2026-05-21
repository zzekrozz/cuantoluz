import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Shirt, Car, Snowflake, UtensilsCrossed, ClipboardList, ArrowRight } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'Calculadoras de coste eléctrico | Lavadora, coche, aire',
  description: 'Calcula cuánto te cuesta cada electrodoméstico según el precio de la luz hoy: lavadora, coche eléctrico, aire acondicionado, lavavajillas y más.',
  path: '/calculadoras',
  keywords: ['calculadora luz', 'calculadora consumo eléctrico', 'cuánto cuesta lavadora', 'calculadora kWh'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Calculadoras', url: '/calculadoras' },
];

const calculators = [
  {
    icon: Shirt,
    title: 'Calculadora de lavadora',
    description: 'Cuánto te cuesta poner una lavadora según la hora y el programa.',
    url: '/calculadoras/lavadora',
  },
  {
    icon: Car,
    title: 'Calculadora de coche eléctrico',
    description: 'Cuánto cuesta cargar tu coche en casa vs en una carga rápida.',
    url: '/calculadoras/coche-electrico',
  },
  {
    icon: Snowflake,
    title: 'Calculadora de aire acondicionado',
    description: 'Cuánto consume y cuesta el aire por hora según la potencia.',
    url: '/calculadoras/aire-acondicionado',
  },
  {
    icon: UtensilsCrossed,
    title: 'Calculadora de lavavajillas',
    description: 'Cuánto cuesta cada ciclo según el programa y la hora.',
    url: '/calculadoras/lavavajillas',
  },
  {
    icon: ClipboardList,
    title: 'Calculadora de consumo eléctrico',
    description: 'Convierte vatios y horas en euros para cualquier aparato.',
    url: '/calculadoras/consumo-electrico',
  },
];

export default function CalculadorasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))}
      />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="hub-h1">Calculadoras de coste eléctrico</h1>
      <p className="hub-lead">
        Convierte el precio de la luz en euros reales. Elige el aparato y descubre cuánto te cuesta usarlo según la hora del día.
      </p>

      <div className="calc-list">
        {calculators.map(calc => (
          <Link key={calc.url} href={calc.url} className="calc-card">
            <div className="calc-card-icon">
              <calc.icon size={28} strokeWidth={1.75} />
            </div>
            <div className="calc-card-content">
              <div className="calc-card-title">
                {calc.title}
                <ArrowRight size={16} className="calc-card-arrow" />
              </div>
              <div className="calc-card-desc">{calc.description}</div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .hub-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 800;
          margin: 8px 0 12px;
          letter-spacing: -0.5px;
        }
        .hub-lead {
          font-size: 16px;
          color: var(--text-soft);
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .calc-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .calc-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .calc-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          text-decoration: none;
        }
        .calc-card-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          background: var(--accent-bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        .calc-card-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }
        .calc-card-arrow {
          color: var(--accent);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
        }
        .calc-card:hover .calc-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .calc-card-desc {
          font-size: 13px;
          color: var(--text-soft);
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
