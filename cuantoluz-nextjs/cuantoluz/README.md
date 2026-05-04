# 🟡 CuantoLuz

Web del precio de la luz en España, hora a hora, con datos oficiales de Red Eléctrica.

## 🚀 Cómo lanzar el proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Modo desarrollo (local)
```bash
npm run dev
```
Abre http://localhost:3000

### 3. Construir para producción
```bash
npm run build
npm run start
```

## ☁️ Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub (puedes crear uno nuevo o usar el existente)
2. Entra en [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub
3. Importa el repositorio
4. Vercel detectará Next.js automáticamente — solo dale a "Deploy"
5. Asocia tu dominio personalizado (cuantoluz.es) en la configuración de Vercel

## 🔌 Cómo funciona la API de REE

- Endpoint propio: `/api/precios`
- Llama a la API pública de REE (sin token)
- **Caché de 1 hora** — Next.js guarda los datos y solo llama a REE cada 60 minutos
- Si REE cae, sirve datos demo como fallback
- Esto significa que tu web puede aguantar millones de visitas sin estresar a REE

## 📦 Estructura del proyecto

```
cuantoluz/
├── app/
│   ├── api/precios/         # API que llama a REE (cacheada)
│   ├── sobre/               # Página "Sobre"
│   ├── que-es-pvpc/         # Artículo PVPC
│   ├── como-ahorrar/        # Artículo trucos
│   ├── precio-luz-manana/   # Artículo precio mañana
│   ├── mercado-libre-vs-regulado/
│   ├── politica-privacidad/
│   ├── politica-cookies/
│   ├── aviso-legal/
│   ├── globals.css          # Estilos globales (oscuro/claro)
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página de inicio
├── components/
│   ├── Header.tsx           # Cabecera con menú y toggle tema
│   ├── Footer.tsx           # Pie con enlaces legales
│   └── CookiesBanner.tsx    # Banner de cookies
├── lib/
│   └── utils.ts             # Funciones, presets, cálculos
└── package.json
```

## 🍪 AdSense

Cuando AdSense te apruebe:

1. Pega el script de AdSense en `app/layout.tsx` dentro del `<head>` (Next.js permite añadirlo con `<Script>` de `next/script`)
2. Coloca los slots de anuncios donde quieras

## ⚠️ Antes de pedir AdSense, asegúrate de:

- [x] Política de privacidad enlazada en footer ✅
- [x] Política de cookies enlazada en footer ✅
- [x] Aviso legal enlazado en footer ✅
- [x] Banner de cookies funcionando ✅
- [x] Página "Sobre" con info ✅
- [x] Mínimo 5 páginas con contenido real ✅
- [ ] Dominio propio (cuantoluz.es) configurado
- [ ] HTTPS activo (Vercel lo da gratis)
- [ ] Email de contacto real (cambiar contacto@cuantoluz.es)

## 📝 Cosas que faltan / por hacer

- Calculadora completa con "Mi día" (la tienes en cuantoluz-v5.html, hay que portarla a React)
- Imagen Open Graph para redes sociales
- Sitemap.xml para Google
- Robots.txt
- Analítica (Google Analytics)

## 🆘 Si algo no funciona

- Si Vercel da error de build → revisa que `npm install` haya instalado todo
- Si la API de REE no responde → la web seguirá funcionando con datos demo
- Si el banner de cookies no aparece → borra el localStorage del navegador
