// ─── SINGLE SOURCE OF TRUTH FOR ALL DESIGN TOKENS ───────────────────────────

// Verticales: cada uno tiene su identidad cromática propia
export const verticals = {
  pensamiento: {
    base: '#4C5BAA',     // índigo apagado
    soft: '#8893C7',
    bgTint: 'rgba(76, 91, 170, 0.10)',
    bgTintStrong: 'rgba(76, 91, 170, 0.18)',
  },
  data: {
    base: '#2F7E7E',     // teal apagado
    soft: '#7FB5B5',
    bgTint: 'rgba(47, 126, 126, 0.10)',
    bgTintStrong: 'rgba(47, 126, 126, 0.18)',
  },
  podcast: {
    base: '#9A5B3B',     // terracota cálido apagado (ya no rosa vibrante)
    soft: '#C99576',
    bgTint: 'rgba(154, 91, 59, 0.10)',
    bgTintStrong: 'rgba(154, 91, 59, 0.18)',
  },
};

// ─── Paleta de tags ─────────────────────────────────────────────
// Cada tag tiene UN color, identificado por una CLAVE CANÓNICA (slug).
// El mismo tag en cualquier idioma cae sobre la misma clave gracias a aliases.

// ─── LISTA CANÓNICA DE TAGS ────────────────────────────────────────────────────
// Esta es la lista FINITA y autorizada. Solo estas claves producen color.
// Para agregar o quitar un tag, editá aquí (y actualizá tagAliases si hace falta).
export const tagPalette: Record<string, { bg: string; fg: string }> = {
  politica:         { bg: '#4C5BAA', fg: '#fff' },   // índigo
  filosofia:        { bg: '#6A6E9E', fg: '#fff' },   // índigo-gris
  economia:         { bg: '#3F7558', fg: '#fff' },   // verde apagado
  'opinion-publica':{ bg: '#875A79', fg: '#fff' },   // malva
  'relaciones internacionales': { bg: '#4A6E9A', fg: '#fff' },
  nlp:              { bg: '#2F7E7E', fg: '#fff' },   // teal
  python:           { bg: '#3A6E8A', fg: '#fff' },
  ml:               { bg: '#326F6F', fg: '#fff' },
  ia:               { bg: '#5B5EA6', fg: '#fff' },   // violeta IA
  estadistica:      { bg: '#4A7C6F', fg: '#fff' },   // verde-gris
  podcast:          { bg: '#9A5B3B', fg: '#fff' },   // terracota
};

// Aliases: variantes en cualquier idioma → clave canónica del tagPalette
// Si un tag del frontmatter no está aquí ni en tagPalette → fallback gris
const tagAliases: Record<string, string> = {
  'politics':               'politica',
  'philosophy':             'filosofia',
  'economy':                'economia',
  'international relations':'relaciones internacionales',
  'public opinion':         'opinion-publica',
  'machine learning':       'ml',
  'artificial intelligence':'ia',
  'statistics':             'estadistica',
  'llm':                    'nlp',
};

// Normaliza: lowercase, sin acentos, sin espacios extra
function slugify(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .trim();
}

export function tagKey(tag: string): string {
  const s = slugify(tag);
  if (tagAliases[s]) return tagAliases[s];
  // intenta con guiones
  const hyphen = s.replace(/\s+/g, '-');
  if (tagPalette[hyphen]) return hyphen;
  if (tagPalette[s])      return s;
  return s; // se usa como clave aún si no tiene color → fallback
}

export const colorFor = (tag: string) =>
  tagPalette[tagKey(tag)] ?? { bg: '#64748B', fg: '#fff' };

// ─── Labels de tags por idioma ────────────────────────────────────────────────
// El frontmatter guarda el tag en cualquier variante; acá se resuelve el texto
// que se muestra (con acentos y traducido). Fallback: el tag tal cual está.
const tagLabels: Record<string, { es: string; en: string }> = {
  politica:         { es: 'política',          en: 'politics' },
  filosofia:        { es: 'filosofía',         en: 'philosophy' },
  economia:         { es: 'economía',          en: 'economics' },
  'opinion-publica':{ es: 'opinión pública',   en: 'public opinion' },
  'relaciones internacionales': { es: 'relaciones internacionales', en: 'international relations' },
  nlp:              { es: 'NLP',               en: 'NLP' },
  python:           { es: 'Python',            en: 'Python' },
  ml:               { es: 'ML',                en: 'ML' },
  ia:               { es: 'IA',                en: 'AI' },
  estadistica:      { es: 'estadística',       en: 'statistics' },
  podcast:          { es: 'podcast',           en: 'podcast' },
};

export function tagLabel(tag: string, lang: 'es' | 'en'): string {
  return tagLabels[tagKey(tag)]?.[lang] ?? tag;
}

export const typography = {
  fontDisplay: "'EB Garamond', 'Georgia', serif",
  fontBody:    "'Inter', 'system-ui', sans-serif",
  fontMono:    "'JetBrains Mono', 'Fira Code', monospace",
};

// Genera CSS variables para AMBOS temas
export function cssVariables(): string {
  return `
    :root {
      /* fonts */
      --font-display: ${typography.fontDisplay};
      --font-body:    ${typography.fontBody};
      --font-mono:    ${typography.fontMono};

      /* radii */
      --radius-sm:   6px;
      --radius-md:   12px;
      --radius-lg:   14px;
      --radius-xl:   18px;
      --radius-full: 9999px;

      /* transitions */
      --transition-fast:   180ms cubic-bezier(.4,0,.2,1);
      --transition-normal: 320ms cubic-bezier(.4,0,.2,1);
      --transition-slow:   520ms cubic-bezier(.4,0,.2,1);

      /* shadows */
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05);
      --shadow-md: 0 6px 16px -4px rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06);
      --shadow-lg: 0 24px 48px -12px rgba(0,0,0,0.18), 0 8px 16px -8px rgba(0,0,0,0.08);

      /* verticales — siempre iguales */
      --color-pensamiento:      ${verticals.pensamiento.base};
      --color-pensamiento-soft: ${verticals.pensamiento.soft};
      --color-pensamiento-tint: ${verticals.pensamiento.bgTint};
      --color-pensamiento-tint-strong: ${verticals.pensamiento.bgTintStrong};

      --color-data:      ${verticals.data.base};
      --color-data-soft: ${verticals.data.soft};
      --color-data-tint: ${verticals.data.bgTint};
      --color-data-tint-strong: ${verticals.data.bgTintStrong};

      --color-podcast:      ${verticals.podcast.base};
      --color-podcast-soft: ${verticals.podcast.soft};
      --color-podcast-tint: ${verticals.podcast.bgTint};
      --color-podcast-tint-strong: ${verticals.podcast.bgTintStrong};
    }

    /* ── LIGHT (default) ─────────────────────────────────────────── */
    :root, :root[data-theme="light"] {
      --color-bg:             #FAF9F6;
      --color-bg-elevated:    #FFFFFF;
      --color-bg-surface:     #FFFFFF;
      --color-bg-hover:       #F2F0EA;
      --color-bg-muted:       #ECEAE3;

      --color-text:           #1A1A1A;
      --color-text-secondary: #4A4A4A;
      --color-text-muted:     #8A8A85;

      --color-border:         #E6E2D9;
      --color-border-light:   #D8D3C7;

      --color-primary:        #1F6F6F;
      --color-primary-light:  #2A8A8A;
      --color-accent:         #1F6F6F;
      --color-accent-light:   #2A8A8A;

      --shadow-card: 0 1px 3px rgba(20,20,20,0.04), 0 6px 18px -6px rgba(20,20,20,0.10);
      --shadow-card-hover: 0 8px 16px -4px rgba(20,20,20,0.08), 0 24px 40px -12px rgba(20,20,20,0.16);
    }

    /* ── DARK ────────────────────────────────────────────────────── */
    :root[data-theme="dark"] {
      --color-bg:             #0E1116;
      --color-bg-elevated:    #171B22;
      --color-bg-surface:     #171B22;
      --color-bg-hover:       #1F242D;
      --color-bg-muted:       #171B22;

      --color-text:           #ECEAE3;
      --color-text-secondary: #A8AAB0;
      --color-text-muted:     #6B6E76;

      --color-border:         #262B33;
      --color-border-light:   #333944;

      --color-primary:        #5FA8A8;
      --color-primary-light:  #7FBFBF;
      --color-accent:         #5FA8A8;
      --color-accent-light:   #7FBFBF;

      --shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 8px 24px -6px rgba(0,0,0,0.5);
      --shadow-card-hover: 0 8px 20px -4px rgba(0,0,0,0.5), 0 24px 48px -12px rgba(0,0,0,0.45);
    }
  `;
}
