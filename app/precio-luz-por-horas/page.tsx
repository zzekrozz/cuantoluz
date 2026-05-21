import type { Metadata } from 'next';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import HomeClient from '../HomeClient';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Precio de la luz por horas hoy en España',
  description: 'Precio de la luz por horas en España actualizado. Mira la tabla con las 24 horas del día y descubre la hora más barata y más cara para consumir.',
  path: '/precio-luz-por-horas',
  keywords: ['precio luz por horas', 'tabla precio luz hoy', 'horario luz hoy', 'luz hora a hora'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Precio de la luz por horas', url: '/precio-luz-por-horas' },
];

export default function PrecioLuzPorHorasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schemaScript(buildBreadcrumbSchema(breadcrumbs))} />
      <Breadcrumbs items={breadcrumbs} />
      <HomeClient />
    </>
  );
}
