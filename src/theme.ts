// ─── SINGLE SOURCE OF TRUTH FOR ALL DESIGN TOKENS ───────────────────────────

// Verticales: cada uno tiene su identidad cromática propia
export const verticals = {
  pensamiento: {
    base: '#7C3AED',     // violet-600
    soft: '#A78BFA',     // violet-400
    bgTint: 'rgba(124, 58, 237, 0.12)',
    bgTintStrong: 'rgba(124, 58, 237, 0.22)',
  },
  data: {
    base: '#0EA5E9',     // sky-500 (más diferenciado del violeta)
    soft: '#7DD3FC',     // sky-300
    bgTint: 'rgba(14, 165, 233, 0.12)',
    bgTintStrong: 'rgba(14, 165, 233, 0.22)',
  },
  podcast: {
    base: '#F43F5E',     // rose-500 (cálido, sonoro)
    soft: '#FDA4AF',     // rose-300
    bgTint: 'rgba(244, 63, 94, 0.12)',
    bgTintStrong: 'rgba(244, 63, 94, 0.22)',
  },
};

// ─── Paleta de tags ─────────────────────────────────────────────
// Cada tag tiene UN color, identificado por una CLAVE CANÓNICA (slug).
// El mismo tag en cualquier idioma cae sobre la misma clave gracias a aliases.

export const tagPalette: Record<string, { bg: string; fg: string }> = {
  politica:         { bg: '#7C3AED', fg: '#fff' },
  filosofia:        { bg: '#6366F1', fg: '#fff' },
  coyuntura:        { bg: '#F59E0B', fg: '#1A1830' },
  economia:         { bg: '#10B981', fg: '#fff' },
  'opinion-publica':{ bg: '#EC4899', fg: '#fff' },
  'relaciones internacionales': { bg: '#3B82F6', fg: '#fff' },
  nlp:              { bg: '#0EA5E9', fg: '#fff' },
  python:           { bg: '#0284C7', fg: '#fff' },
  ml:               { bg: '#06B6D4', fg: '#fff' },
  datos:            { bg: '#0EA5E9', fg: '#fff' },
  podcast:          { bg: '#F43F5E', fg: '#fff' },
};

// Aliases: variantes en cualquier idioma → clave canónica
const tagAliases: Record<string, string> = {
  'politics':         'politica',
  'philosophy':       'filosofia',
  'current affairs':  'coyuntura',
  'economy':          'economia',
  'international relations': 'relaciones internacionales',
  'public opinion':   'opinion-publica',
  'machine learning': 'ml',
  'data':             'datos',
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

export const typography = {
  fontDisplay: "'Playfair Display', 'Georgia', serif",
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
      --radius-md:   14px;
      --radius-lg:   20px;
      --radius-xl:   28px;
      --radius-full: 9999px;

      /* transitions */
      --transition-fast:   180ms cubic-bezier(.4,0,.2,1);
      --transition-normal: 320ms cubic-bezier(.4,0,.2,1);
      --transition-slow:   520ms cubic-bezier(.4,0,.2,1);

      /* shadows */
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05);
      --shadow-md: 0 6px 16px -4px rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06);
      --shadow-lg: 0 24px 48px -12px rgba(0,0,0,0.18), 0 8px 16px -8px rgba(0,0,0,0.08);
      --shadow-glow: 0 0 0 1px rgba(124,58,237,0.18), 0 8px 32px -8px rgba(124,58,237,0.22);

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
      --color-bg:             #FAFAF7;
      --color-bg-elevated:    #FFFFFF;
      --color-bg-surface:     #FFFFFF;
      --color-bg-hover:       #F4F2EE;
      --color-bg-muted:       #EFEDE7;

      --color-text:           #1A1830;
      --color-text-secondary: #4A4866;
      --color-text-muted:     #8B8AA3;

      --color-border:         #E5E1D8;
      --color-border-light:   #D9D5C9;

      --color-primary:        #7C3AED;
      --color-primary-light:  #8B5CF6;
      --color-accent:         #0EA5E9;
      --color-accent-light:   #38BDF8;

      --gradient-hero: linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F59E0B 100%);
      --gradient-glow: radial-gradient(60% 50% at 50% 0%, rgba(124,58,237,0.18), transparent 70%);

      --shadow-card: 0 1px 3px rgba(20,18,40,0.04), 0 6px 18px -6px rgba(20,18,40,0.10);
      --shadow-card-hover: 0 8px 16px -4px rgba(20,18,40,0.08), 0 24px 40px -12px rgba(20,18,40,0.18);
    }

    /* ── DARK ────────────────────────────────────────────────────── */
    :root[data-theme="dark"] {
      --color-bg:             #0F0E17;
      --color-bg-elevated:    #1A1830;
      --color-bg-surface:     #1A1830;
      --color-bg-hover:       #22203A;
      --color-bg-muted:       #1A1830;

      --color-text:           #F0EFFF;
      --color-text-secondary: #A09EC0;
      --color-text-muted:     #6B6892;

      --color-border:         #2E2B50;
      --color-border-light:   #3D3A64;

      --color-primary:        #A78BFA;
      --color-primary-light:  #C4B5FD;
      --color-accent:         #38BDF8;
      --color-accent-light:   #7DD3FC;

      --gradient-hero: linear-gradient(135deg, #A78BFA 0%, #F472B6 50%, #FBBF24 100%);
      --gradient-glow: radial-gradient(60% 50% at 50% 0%, rgba(167,139,250,0.22), transparent 70%);

      --shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 8px 24px -6px rgba(0,0,0,0.5);
      --shadow-card-hover: 0 8px 20px -4px rgba(0,0,0,0.5), 0 24px 48px -12px rgba(124,58,237,0.25);
    }
  `;
}
