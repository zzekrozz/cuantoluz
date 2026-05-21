# CuantoLuz v3 — Rebuild SEO completo

Versión 3.0.0 con arquitectura SEO completa basada en el plan estratégico.

## Cambios principales vs v2

### 🆕 Nueva arquitectura de páginas

**Páginas principales (precio):**
- `/` — Home como "Answer Page" (precio luz hoy)
- `/precio-luz-hoy/` — alternativa SEO con misma funcionalidad
- `/precio-luz-manana/` — precio del día siguiente
- `/precio-luz-por-horas/` — variante SEO

**Calculadoras (NUEVO):**
- `/calculadoras/` — hub
- `/calculadoras/lavadora/`
- `/calculadoras/coche-electrico/`
- `/calculadoras/aire-acondicionado/`
- `/calculadoras/lavavajillas/`
- `/calculadoras/consumo-electrico/`

**Electrodomésticos (NUEVO):**
- `/electrodomesticos/` — hub
- `/electrodomesticos/cuanto-cuesta-poner-una-lavadora/`
- `/electrodomesticos/cuanto-consume-una-lavadora/`
- `/electrodomesticos/mejor-hora-poner-lavadora/` ⭐ (página estrella con dato vivo)
- `/electrodomesticos/programa-eco-40-60/`
- `/electrodomesticos/cuanto-consume-un-aire-acondicionado/`
- `/electrodomesticos/cuanto-consume-un-lavavajillas/`

**Guías (NUEVO):**
- `/guias/` — hub
- `/guias/que-es-pvpc/`
- `/guias/mercado-regulado-vs-mercado-libre/`
- `/guias/como-funciona-precio-luz-por-horas/`
- `/guias/como-ahorrar-luz-en-casa/`
- `/guias/que-electrodomesticos-consumen-mas/`

**Otros (NUEVO):**
- `/metodologia/` — credibilidad / E-E-A-T

### 🔧 SEO técnico

1. **Sitemap dinámico** (`/sitemap.xml`) generado automáticamente con prioridades por página
2. **Robots.txt** dinámico (`/robots.txt`)
3. **Metadata completa** en cada página: title, description, OpenGraph, Twitter Card, canonical
4. **Schema.org JSON-LD** en cada página:
   - `WebSite` y `Organization` (root)
   - `WebApplication` para calculadoras
   - `Article` para guías y artículos
   - `BreadcrumbList` para todas las páginas
   - `FAQPage` para artículos con preguntas frecuentes
5. **Breadcrumbs** visibles en todas las páginas no-home
6. **Interlinking** sistemático con componente `RelatedLinks`

### 🎨 UX/UI

- Navegación nueva en Header con menú móvil
- Footer ampliado con 4 columnas organizadas por categoría
- Calculadoras destacadas en la Home
- Widget `PriceLiveWidget` reutilizable en artículos
- Widget `MejorHoraLavadoraWidget` con dato vivo (diferenciador clave SEO)

## Stack técnico

- Next.js 14 (App Router) + TypeScript
- Lucide React para iconografía
- API pública de Red Eléctrica de España (REE) para precios PVPC
- Google Analytics G-N40S4XBT1E

## Próximos pasos recomendados (SEO)

1. **Configurar Google Search Console** y enviar el sitemap
2. **Añadir código de verificación** en `app/layout.tsx` (línea con `verification.google`)
3. **Generar más contenido editorial** mensual (mantener "fresh" el cluster electrodomésticos)
4. **Backlinks**: foros, redes sociales, comparadores
5. Considerar añadir página `/precio-luz-historico/` con datos archivados

## Comandos

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # producción
npm start
```
