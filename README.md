# Manuel Miller — Sitio personal

Sitio estático construido con [Astro](https://astro.build/). Bilingüe (ES/EN), modo claro/oscuro, blog con dos áreas (Pensamiento + Ciencia de Datos) y un canal de Podcast.

## Cómo correrlo

```bash
npm install
npm run dev      # arranca en http://localhost:4321
npm run build    # genera /dist (sitio listo para deploy)
```

---

## Estructura completa del proyecto

```
manuel-miller-site/
├── public/                 ← archivos servidos tal cual (favicon, imágenes, audios)
├── src/
│   ├── theme.ts            ← TODOS los colores y tokens de diseño
│   ├── i18n.ts             ← textos fijos de la interfaz (ES/EN) y helpers de idioma
│   ├── env.d.ts            ← types de Astro (no tocar)
│   │
│   ├── styles/
│   │   └── global.css      ← reset, tipografía base, scrollbar, animaciones reutilizables
│   │
│   ├── layouts/
│   │   └── Base.astro      ← plantilla HTML común (head, theme bootstrap, header, footer)
│   │
│   ├── components/         ← piezas reutilizables
│   │   ├── Header.astro          ← barra superior (logo, links, toggle tema, idioma)
│   │   ├── Footer.astro          ← pie del sitio
│   │   ├── PostCard.astro        ← tarjeta de una entrada (con su variante invertida para Data)
│   │   └── TagMultiSelect.astro  ← dropdown de filtro multi-etiqueta
│   │
│   ├── content/            ← LAS ENTRADAS DEL BLOG (Markdown)
│   │   ├── config.ts                       ← schema de los .md (qué campos exige)
│   │   ├── pensamiento/                    ← una carpeta por vertical
│   │   │   ├── democracia-datos.es.md
│   │   │   └── democracia-datos.en.md
│   │   ├── ciencia-de-datos/
│   │   │   ├── analisis-sentimiento.es.md
│   │   │   └── analisis-sentimiento.en.md
│   │   └── podcast/                        ← futuras entradas de podcast
│   │
│   └── pages/              ← cada archivo .astro se convierte en una URL del sitio
│       ├── index.astro                ← "/"            home en español (el "Blog")
│       ├── sobre-mi.astro             ← "/sobre-mi"    página About en español
│       │
│       ├── pensamiento/
│       │   └── [slug].astro           ← "/pensamiento/<id>"     renderiza UNA entrada
│       ├── ciencia-de-datos/
│       │   └── [slug].astro           ← "/ciencia-de-datos/<id>" renderiza UNA entrada
│       ├── podcast/
│       │   └── index.astro            ← "/podcast"     página del podcast
│       │
│       └── en/                        ← versiones en inglés (mismo patrón)
│           ├── index.astro            ← "/en"          home EN
│           ├── about.astro            ← "/en/about"
│           ├── thinking/[slug].astro  ← "/en/thinking/<id>"
│           ├── data-science/[slug].astro
│           └── podcast/index.astro
```

### ¿Por qué hay carpetas con el nombre del vertical en pages/?

Sólo para renderizar **una entrada individual**. El archivo `pages/pensamiento/[slug].astro` toma el slug de la URL (`/pensamiento/mi-entrada`) y muestra esa entrada con su layout completo.

**No hay** un `pages/pensamiento/index.astro` — antes existía y mostraba una lista de entradas de Pensamiento, pero ahora todo eso vive en la home (el Blog). Si en el futuro querés una página "/pensamiento" que liste sólo esas entradas, se vuelve a agregar.

### ¿Por qué dentro de `en/` se repiten los verticales?

Astro genera URLs a partir de la estructura de `pages/`. Como las URLs en inglés son `/en/thinking/...` y `/en/data-science/...`, necesitan vivir en carpetas con esos nombres. Es solo el routing del idioma — la lógica está duplicada minimamente porque cada idioma puede tener slugs distintos.

---

## Recetas: dónde editar para hacer cada cambio

| Querés cambiar… | Archivo a editar |
|---|---|
| El texto del header (Blog / Podcast / Sobre mí) | `src/i18n.ts` (claves `nav.*`) |
| Qué links aparecen en el header | `src/components/Header.astro` (array `navItems`) |
| Los colores generales (claro/oscuro, primarios) | `src/theme.ts`, función `cssVariables()` |
| El color de un vertical (Pensamiento / Datos / Podcast) | `src/theme.ts`, objeto `verticals` |
| El color de un tag | `src/theme.ts`, objeto `tagPalette` |
| Agregar una entrada al blog | Crear `.md` en `src/content/<vertical>/` (ver más abajo) |
| Cómo se ve cada tarjeta de entrada | `src/components/PostCard.astro` |
| Cómo se ve la home (verticales protagonistas, hero) | `src/pages/index.astro` (ES) y `src/pages/en/index.astro` (EN) |
| Cómo se ve una entrada individual | `src/pages/pensamiento/[slug].astro` (y los otros tres `[slug].astro`) |
| Estilos globales (tipografía, scroll, animaciones base) | `src/styles/global.css` |

---

## Cómo agregar una entrada nueva al blog

Cada entrada es un archivo Markdown en `src/content/<vertical>/<slug>.<idioma>.md`.

1. Elegí el vertical: `pensamiento`, `ciencia-de-datos` o `podcast`.
2. Creá el archivo con la convención `<slug>.<idioma>.md`. Por ejemplo:
   - `src/content/pensamiento/mi-nueva-entrada.es.md`
   - `src/content/pensamiento/mi-nueva-entrada.en.md` (opcional, versión EN)
3. Frontmatter obligatorio:

```yaml
---
title: "Título de la entrada"
date: "2026-06-15"
description: "Resumen corto que aparece en la tarjeta."
tags: ["Política", "Coyuntura"]
lang: es                          # 'es' o 'en'
postId: mi-nueva-entrada          # IDÉNTICO en la versión ES y EN
cover: /images/mi-foto.jpg        # opcional, ruta dentro de /public
---

Cuerpo en Markdown estándar.
```

**`postId`** es la clave que une las traducciones. Si querés que el toggle EN/ES de una entrada lleve a su par, las dos versiones deben compartirlo.

**`tags`** pueden estar en cualquier idioma; el sistema usa una clave canónica (ver `src/theme.ts` → función `tagKey`) para que `"Política"` y `"Politics"` se filtren como el mismo tag.

---

## Cómo agregar / cambiar un tag y su color

En `src/theme.ts`:

```ts
export const tagPalette = {
  // … los que ya están …
  'mi-nuevo-tag': { bg: '#FF5733', fg: '#fff' },
};

// Si existe en otro idioma, mapealo a la clave canónica:
const tagAliases = {
  'my new tag': 'mi-nuevo-tag',
};
```

Después usás `"Mi nuevo tag"` o `"My new tag"` en el `tags:` de cualquier entrada — el color se aplica automáticamente.

---

## Modo claro / oscuro

- Variables CSS para cada modo: `src/theme.ts`, dentro de `cssVariables()` en los bloques `:root[data-theme="light"]` y `:root[data-theme="dark"]`.
- Botón sol/luna: en `src/components/Header.astro`. Persiste la elección en `localStorage` y la lee antes de la hidratación (script en `src/layouts/Base.astro`) para evitar el "flash" al cargar.

---

## Notebooks (.ipynb) y RMarkdown (.Rmd) para entradas de Data Science

Tres caminos posibles:

1. **Markdown puro (recomendado para empezar)**. Renderizás tus gráficos y los pegás como imágenes en `/public/images/...`, las referencias desde el `.md`:
   ```markdown
   ![Distribución de sentimiento](/images/sentimiento-distribucion.png)
   ```
2. **Jupyter → Markdown** con `nbconvert` o `jupytext`. Salida queda en `src/content/...` con código y gráficos incrustados.
3. **RMarkdown → Markdown/HTML** con `knit`. Mismo destino.

Mientras el blog sea chico, lo más simple es la opción 1. Cuando crezca podemos automatizar un pipeline de conversión.

---

## Roadmap pendiente

- Página individual de podcast con embed de audio (Spotify / RSS).
- RSS feed propio (`/feed.xml`).
- Sitemap automático (`@astrojs/sitemap`).
- Conexión a un gestor de podcasts (Spotify for Podcasters / Anchor).
- Búsqueda en cliente (Fuse.js o Pagefind).
