import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas estáticas con prioridad
  const staticPages = [
    // Cluster principal (máxima prioridad)
    { path: '/', priority: 1.0, changeFrequency: 'hourly' as const },
    { path: '/precio-luz-hoy', priority: 0.95, changeFrequency: 'hourly' as const },
    { path: '/precio-luz-manana', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/precio-luz-por-horas', priority: 0.9, changeFrequency: 'hourly' as const },

    // Calculadoras
    { path: '/calculadoras', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/calculadoras/lavadora', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/calculadoras/coche-electrico', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/calculadoras/aire-acondicionado', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/calculadoras/lavavajillas', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/calculadoras/consumo-electrico', priority: 0.85, changeFrequency: 'weekly' as const },

    // Electrodomésticos (artículos con datos vivos)
    { path: '/electrodomesticos', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/electrodomesticos/cuanto-cuesta-poner-una-lavadora', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/electrodomesticos/cuanto-consume-una-lavadora', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/electrodomesticos/mejor-hora-poner-lavadora', priority: 0.85, changeFrequency: 'daily' as const },
    { path: '/electrodomesticos/programa-eco-40-60', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/electrodomesticos/cuanto-consume-un-aire-acondicionado', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/electrodomesticos/cuanto-consume-un-lavavajillas', priority: 0.75, changeFrequency: 'monthly' as const },

    // Guías
    { path: '/guias', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/guias/que-es-pvpc', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/guias/mercado-regulado-vs-mercado-libre', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/guias/como-funciona-precio-luz-por-horas', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/guias/como-ahorrar-luz-en-casa', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/guias/que-electrodomesticos-consumen-mas', priority: 0.75, changeFrequency: 'monthly' as const },

    // Metodología
    { path: '/metodologia', priority: 0.5, changeFrequency: 'monthly' as const },

    // Información
    { path: '/sobre', priority: 0.4, changeFrequency: 'monthly' as const },

    // Legal (baja prioridad)
    { path: '/aviso-legal', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/politica-privacidad', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/politica-cookies', priority: 0.2, changeFrequency: 'yearly' as const },
  ];

  return staticPages.map(page => ({
    url: `${SITE_CONFIG.url}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
