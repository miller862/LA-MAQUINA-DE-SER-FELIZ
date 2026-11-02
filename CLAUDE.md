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
- Hecho 2026-10-29 (local, sin push): cuerpo de las notas en EB Garamond (`.post-content.prose` en `global.css`: 1.25rem, 1.125rem en mobile, interlineado 1.6, `--color-text`, cifras antiguas, columna de 30em (antes 27em) = unos 67-75 caracteres por linea; los margenes de los Word siguen calculados para 27em y quedan por actualizar, alineada a la izquierda con el encabezado, imagenes con max-width). Se saco el gris de `.post-content` en los cuatro `[slug].astro`. Sobre mi no cambia (sigue en Inter). EB Garamond instalada en la PC de escritorio (usuario); en la notebook hay que instalarla para los Word. Los Word de `Escritos e ideas/` quedaron en EB Garamond 14 pt, interlineado 1,23, cifras antiguas y margenes de 3,83 cm (columna 378 pt); plantilla `Plantilla entrada (EB Garamond).dotx`; respaldos en `Escritos e ideas/_respaldo_antes_de_garamond/`. OJO: `Ideas y fragmentos.docx` y el docx de rituales estan versionados en git (entraron antes del .gitignore) y aparecen modificados.
- Hecho 2026-10-29 (local, sin push): 6 retratos en tinta (Maquiavelo, Han, Schmitt, Rosas, Perón, Benjamin) en `public/img/retratos/retrato-<nombre>.jpg` (1122x1402, JPG q90, ~450-560 KB, originales PNG quedan en el escritorio). No aparecen en la web hasta que una nota los llame con `<figure>`. Prompt para generar más: `Escritos e ideas/prompt_retratos_tinta.json` (git-ignorado).
- Hecho 2026-10-29 (local, sin push): portada de rituales (ES y EN) pasó a `/img/retratos/retrato-han.jpg`; `retrato-papa.jpg` queda disponible para el borrador nuevo (que NO se publica todavía). La portada SVG del codificador mantiene su fondo negro, pero ahora el panel de la card (`PostCard.astro`, `--cover-svg-bg`) se pinta del mismo negro y llena todo el recuadro, sin margen teal.
- Hecho 2026-11-02 (local, sin push): nota `poder-amabilidad-humanidad` LISTA PARA PUBLICAR en ES y EN (`src/content/pensamiento/poder-amabilidad-humanidad.es.md` y `.en.md`, `draft: false`, fecha 2026-11-02, tags politica/filosofia/ia, cover `retrato-papa.jpg` y el mismo retrato como `<figure>` en el medio de la nota). Se sacó la línea de `.git/info/exclude`, así que los dos archivos ya figuran para git; `public/img/retratos/` sigue sin trackear y hay que agregarlo en el mismo push. Citas en APA 7 con bibliografía al final (Han 2021/2022a/2022b, León XIV 2026, Francisco 2013, Weber 1922/2014, Žižek 2026, Biblia: El Libro del Pueblo de Dios en ES y New American Bible en EN). Las citas de Han, Weber y la encíclica en la versión EN son traducción propia y está aclarado al pie. Sin verificar: los números de párrafo de la encíclica del 100 en adelante (vatican.va y EWTN cortan el texto cerca del párr. 77). El prompt de retratos y el original del papa viven en `public/img/retratos/` (`prompt_*` y `original-*` van en `.gitignore`).
- Hecho 2026-11-02: `.post-content.prose` lleva `overflow-wrap: break-word` en `global.css`. Sin eso, las URLs largas de la bibliografía desbordaban la página a 390 px y aparecía scroll horizontal. Verificado a 390 y 1440 px, en claro y oscuro, en las dos versiones de la nota.
- Hecho 2026-10-29 (local, sin push): cita unificada. `.prose blockquote` (con o sin `class="song-quote"`) pasó a filete lateral de 3px en la tinta de la vertical (`--quote-ink`, versión `-soft` en oscuro), sin caja ni fondo, Garamond cursiva 1.5rem, firma en `<footer>` Garamond redonda sin mayúsculas. Las 4 páginas de nota llevan `data-vertical` en `.post-content` para elegir la tinta. Uso: `<blockquote><p>texto</p><footer>— Autor, <cite>Obra</cite></footer></blockquote>`.
- Pendientes: (1) player persistente entre páginas — plan: mini-player global con `<audio>` nativo (MP3 del feed RSS) + ClientRouter con `transition:persist`; requiere migrar listeners de Header/TagMultiSelect a `astro:page-load`. (2) Bilingüismo: se mantiene manual por decisión del autor (sin tokens para traducir vía LLM por ahora). (3) Mini-apps DS: plan A = islands con Plotly/Vega en MDX; plan B = marimo WASM en /public/apps/. (4) OG image dedicada (hoy usa /fotopersonal.jpg). (5) Analytics sin cookies (Plausible/GoatCounter).

## Convenciones de trabajo

- Explorar antes de proponer; proponer opciones antes de implementar.
- Cambios chicos y deployables; probar con `npm run build` antes de dar por terminado.
- OJO en sesiones de Cowork: editar archivos vía herramientas de Windows puede dejar la vista del mount de la VM desincronizada (archivos truncados al hacer build). Si el build falla con errores de sintaxis raros, reescribir el archivo desde bash.
- Borradores e ideas del autor en `Escritos e ideas/` (docx, no tocar sin pedido).
- Ningun Word va al repo: *.docx, *.doc y *.dotx estan en .gitignore. El 2026-11-02 se saco del indice podcast_rituales.docx (sigue en disco) y las bajas de los dos docx de `Escritos e ideas/` quedaron confirmadas. Los Word viven solo en la maquina.
