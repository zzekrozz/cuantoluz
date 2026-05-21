import type { Metadata } from 'next';
import { buildMetadata, organizationSchema, websiteSchema, schemaScript } from '@/lib/seo';
import HomeClient from './HomeClient';

export const metadata: Metadata = buildMetadata({
  title: 'Precio de la luz hoy por horas en España | Hora más barata y más cara',
  description: 'Consulta el precio de la luz hoy por horas en España: tabla PVPC, hora más barata, hora más cara, precio medio y calculadoras para saber cuánto cuesta poner la lavadora, el aire o cargar tu coche eléctrico.',
  path: '/',
  keywords: ['precio luz hoy', 'precio luz por horas', 'precio kWh hoy', 'hora más barata luz', 'PVPC', 'tarifa luz hoy'],
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(organizationSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={schemaScript(websiteSchema)}
      />
      <HomeClient />
    </>
  );
}
