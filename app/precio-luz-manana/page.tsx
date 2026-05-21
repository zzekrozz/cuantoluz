import type { Metadata } from 'next';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';
import TomorrowClient from './TomorrowClient';

export const metadata: Metadata = buildMetadata({
  title: 'Precio de la luz mañana en España por horas',
  description: 'Consulta el precio de la luz para mañana en España hora a hora. Datos PVPC publicados por Red Eléctrica a partir de las 20:15h. Planifica tu consumo.',
  path: '/precio-luz-manana',
  keywords: ['precio luz mañana', 'tarifa luz mañana', 'hora más barata mañana', 'PVPC mañana'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Precio de la luz mañana', url: '/precio-luz-manana' },
];

export default function PrecioLuzMananaPage() {
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(breadcrumbSchema)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="page-h1">Precio de la luz mañana en España por horas</h1>
      <p className="page-lead">
        Red Eléctrica de España publica el precio de la luz del día siguiente a partir de las 20:15h. Aquí podrás verlo en cuanto esté disponible.
      </p>
      <TomorrowClient />

      <style>{`
        .page-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 800;
          margin: 8px 0 12px;
          letter-spacing: -0.5px;
        }
        .page-lead {
          font-size: 16px;
          color: var(--text-soft);
          margin-bottom: 24px;
          line-height: 1.6;
        }
      `}</style>
    </>
  );
}
