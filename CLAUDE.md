# BLOG_MM — manuelmiller.com.ar

Blog personal de Manuel Miller (politólogo y data scientist). Bilingüe ES/EN.
**Leé este archivo completo antes de proponer o tocar nada. Mantenelo actualizado al final de cada sesión de trabajo.**

## Stack y restricciones (NO negociables)

- Astro 6 + @astrojs/mdx + @astrojs/rss + @astrojs/sitemap. Sin frameworks UI. Sin backend ni base de datos.
- Deploy: Netlify conectado a GitHub. Todo cambio debe funcionar con `git push`.
- No cambiar la identidad visual: tokens en `src/theme.ts` (única fuente de verdad de colores/tipografía), paleta cálida clara/oscura, EB Garamond display + Inter body + JetBrains Mono.
- `site: 'https://manuelmiller.com.ar'` configurado en astro.config.mjs (lo usan sitemap, RSS, canonical y OG).

## Arquitectura

- **Contenido**: content collections con glob loader (`src/content.config.ts`). Tres colecciones: `pensamiento`, `ciencia-de-datos`, `podcast` (esta última VACÍA; el build avisa "collection podcast does not exist or is empty" — es esperable, no es error).
- **Bilingüismo**: cada post son 2 archivos `slug.es.md` / `slug.en.md` unidos por `postId` en frontmatter. Strings de UI en `src/i18n.ts` (objeto `ui` + `t()`, `localizedPath()`, y helpers `formatDate()` y `readingTime()`). Rutas ES sin prefijo, EN bajo `/en/` con templates duplicados en `src/pages/en/*` (fricción conocida; el autor decidió mantener la estructura actual por ahora).
- **Frontmatter schema**: title, date (string ISO), description, tags, cover?, lang, postId, draft, podcastEpisodeUrl? (embed RSS.com).
- **Visibilidad**: `src/content/visibility.ts` — `hiddenPostIds` oculta posts en ambos idiomas a la vez.
- **Layout**: `Base.astro` (CSS vars de theme.ts, theme dark/light anti-flash, y todo el SEO: canonical, hreflang es/en/x-default, OG/Twitter con `ogImage`/`ogType` como props, link a RSS y sitemap). `Header.astro`, `Footer.astro`, `PostCard.astro` (panel podcast inferior con player compacto embebido), `PodcastPlayer.astro` (iframe RSS.com o mockup), `TagMultiSelect.astro`.
- **SEO/infra**: `src/pages/rss.xml.js` (feed ES de ambas verticales), sitemap automático, `public/robots.txt`, `src/pages/404.astro`.
- **No hay ClientRouter / view transitions** → navegación MPA pura, el player se corta al navegar (pendiente).

## Podcast

- Nombre: "La Máquina de Ser Feliz". Host: RSS.com (player embebido vía `podcastEpisodeUrl`).
- Los episodios viven como posts de cualquier colección con `podcastEpisodeUrl`. `/podcast` (ES y EN) los junta cross-collection, los numera por fecha ascendente y muestra player embebido + link al artículo. Si la colección `podcast` algún día tiene entradas propias, también se listan (sin link de artículo; no existe `/podcast/[slug]`).
- En las tarjetas del listado (PostCard), los posts con episodio muestran un botón circular sobrio (columna derecha en desktop, franja inferior en mobile) que ancla a `#player` dentro de la nota. NO embeber el iframe de RSS.com en las cards: al autor le parece feo y poco profesional (probado y revertido 2026-06-11). Evitar también bordes punteados/degradés llamativos en ese container.

## Estado / pendientes (actualizar acá)

- Post publicados: `rituales` (pensamiento, ES+EN, episodio 1 del podcast). `codificador-preguntas-abiertas` (ciencia-de-datos, ES+EN) OCULTO vía hiddenPostIds.
- Hecho 2026-06-11: /podcast real ES+EN; botón de episodio rediseñado en cards (ancla a #player; el embed en cards se probó y revertió); player de nota a 200px (antes 150, se veía recortado) con ?theme= sincronizado al theme del sitio vía script en PodcastPlayer; SEO completo en Base (canonical/hreflang/OG/Twitter); RSS feed; sitemap; robots.txt; 404; fechas formateadas (Intl) + tiempo de lectura en posts y cards; borrado `src/content/config.ts` legacy. Tags con label traducido por idioma vía `tagLabel()` en theme.ts (cards, header de post y filtro; la clave canónica para filtrar no cambia). Blockquote `.song-quote` sin comilla decorativa ::before (quedaba huérfana y duplicaba las comillas del texto).
- Pendientes: (1) player persistente entre páginas — plan: mini-player global con `<audio>` nativo (MP3 del feed RSS) + ClientRouter con `transition:persist`; requiere migrar listeners de Header/TagMultiSelect a `astro:page-load`. (2) Bilingüismo: se mantiene manual por decisión del autor (sin tokens para traducir vía LLM por ahora). (3) Mini-apps DS: plan A = islands con Plotly/Vega en MDX; plan B = marimo WASM en /public/apps/. (4) OG image dedicada (hoy usa /fotopersonal.jpg). (5) Analytics sin cookies (Plausible/GoatCounter).

## Convenciones de trabajo

- Explorar antes de proponer; proponer opciones antes de implementar.
- Cambios chicos y deployables; probar con `npm run build` antes de dar por terminado.
- OJO en sesiones de Cowork: editar archivos vía herramientas de Windows puede dejar la vista del mount de la VM desincronizada (archivos truncados al hacer build). Si el build falla con errores de sintaxis raros, reescribir el archivo desde bash.
- Borradores e ideas del autor en `Escritos e ideas/` (docx, no tocar sin pedido).
