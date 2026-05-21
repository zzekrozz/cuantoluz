// SEO Helpers - Sistema centralizado de metadata, schema.org y URLs
import type { Metadata } from 'next';

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

export const SITE_CONFIG = {
  name: 'CuantoLuz',
  url: 'https://cuantoluz.es',
  description: 'Precio de la luz hoy en España hora a hora y calculadoras de coste real para tus aparatos.',
  email: 'cuantoluz@gmail.com',
  twitter: '@cuantoluz',
  locale: 'es_ES',
  authorName: 'Equipo CuantoLuz',
} as const;

// ============================================================================
// GENERADOR DE METADATA
// ============================================================================

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  imageUrl?: string;
}

export function buildMetadata(page: PageMetadata): Metadata {
  const url = `${SITE_CONFIG.url}${page.path}`;
  const fullTitle = page.title.includes(SITE_CONFIG.name)
    ? page.title
    : `${page.title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description: page.description,
    keywords: page.keywords,
    authors: [{ name: SITE_CONFIG.authorName }],
    alternates: {
      canonical: url,
    },
    robots: page.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
    openGraph: {
      title: fullTitle,
      description: page.description,
      url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: page.publishedTime ? 'article' : 'website',
      ...(page.publishedTime && { publishedTime: page.publishedTime }),
      ...(page.modifiedTime && { modifiedTime: page.modifiedTime }),
      ...(page.imageUrl && {
        images: [{ url: page.imageUrl, width: 1200, height: 630, alt: page.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page.description,
      ...(page.imageUrl && { images: [page.imageUrl] }),
    },
  };
}

// ============================================================================
// SCHEMA.ORG - JSON-LD
// ============================================================================

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  email: SITE_CONFIG.email,
  sameAs: [],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  inLanguage: 'es-ES',
  publisher: {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
};

interface CalculatorSchemaInput {
  name: string;
  description: string;
  url: string;
  category?: string;
}

export function buildCalculatorSchema(input: CalculatorSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: `${SITE_CONFIG.url}${input.url}`,
    applicationCategory: input.category || 'UtilityApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    inLanguage: 'es-ES',
  };
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: `${SITE_CONFIG.url}${input.url}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    inLanguage: 'es-ES',
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}${input.url}`,
    },
    ...(input.imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: input.imageUrl,
      },
    }),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// ============================================================================
// HELPER: SCHEMA INLINE COMPONENT
// ============================================================================

export function schemaScript(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
