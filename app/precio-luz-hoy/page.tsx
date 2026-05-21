import type { Metadata } from 'next';
import { buildMetadata, buildBreadcrumbSchema, schemaScript } from '@/lib/seo';
import HomeClient from '../HomeClient';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Precio de la luz hoy en España por horas (PVPC actualizado)',
  description: 'Precio de la luz hoy en España actualizado hora a hora. Consulta la tarifa PVPC, hora más barata, más cara y media del día. Datos oficiales de Red Eléctrica.',
  path: '/precio-luz-hoy',
  keywords: ['precio luz hoy', 'precio kWh hoy', 'PVPC hoy', 'tarifa luz hoy', 'precio electricidad hoy'],
});

const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Precio de la luz hoy', url: '/precio-luz-hoy' },
];

export default function PrecioLuzHoyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(breadcrumbSchema)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <HomeClient />
    </>
  );
}
