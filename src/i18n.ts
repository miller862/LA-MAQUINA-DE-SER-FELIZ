// All static UI strings. Add keys here for both languages.

export const ui = {
  es: {
    'nav.blog':           'Blog',
    'nav.pensamiento':    'Pensamiento',
    'nav.datos':          'Ciencia de Datos',
    'nav.podcast':        'Podcast',
    'nav.sobre':          'Sobre mí',
    'home.subtitle':      'Politólogo · Data Scientist',
    'home.intro':         'Escribo sobre política, datos y las ideas que me obsesionan.',
    'home.all':           'Todo',
    'home.latest':        'Últimas entradas',
    'home.readMore':      'Leer más',
    'home.noEntries':     'No hay entradas para este filtro.',
    'vertical.pensamiento.desc': 'Política, filosofía y análisis de coyuntura.',
    'vertical.datos.desc':      'Proyectos y análisis con datos.',
    'vertical.podcast.desc':    'Conversaciones en audio.',
    'coming.title':       'Próximamente',
    'coming.text':        'Esta sección está en construcción.',
    'about.title':        'Sobre mí',
    'footer.rights':      'Todos los derechos reservados.',
  },
  en: {
    'nav.blog':           'Blog',
    'nav.pensamiento':    'Thinking',
    'nav.datos':          'Data Science',
    'nav.podcast':        'Podcast',
    'nav.sobre':          'About',
    'home.subtitle':      'Political Scientist · Data Scientist',
    'home.intro':         'I write about politics, data, and the ideas that obsess me.',
    'home.all':           'All',
    'home.latest':        'Latest entries',
    'home.readMore':      'Read more',
    'home.noEntries':     'No entries for this filter.',
    'vertical.pensamiento.desc': 'Politics, philosophy and current affairs.',
    'vertical.datos.desc':      'Projects and data-driven analysis.',
    'vertical.podcast.desc':    'Conversations in audio.',
    'coming.title':       'Coming Soon',
    'coming.text':        'This section is under construction.',
    'about.title':        'About me',
    'footer.rights':      'All rights reserved.',
  },
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof typeof ui['es'];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key];
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return 'es';
}

export function getOppositeLocale(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

// Segment translation map: es → en and en → es
const segmentMap: Record<string, Record<Lang, string>> = {
  'pensamiento':      { es: 'pensamiento',      en: 'thinking' },
  'thinking':         { es: 'pensamiento',      en: 'thinking' },
  'ciencia-de-datos': { es: 'ciencia-de-datos', en: 'data-science' },
  'data-science':     { es: 'ciencia-de-datos', en: 'data-science' },
  'podcast':          { es: 'podcast',          en: 'podcast' },
  'sobre-mi':         { es: 'sobre-mi',         en: 'about' },
  'about':            { es: 'sobre-mi',         en: 'about' },
};

export function localizedPath(lang: Lang, path: string): string {
  // Strip the /en prefix if present
  const clean = path.replace(/^\/(es|en)/, '') || '/';
  // Translate each segment
  const translated = clean.replace(/^\/([^/]+)/, (_, seg) => {
    const mapped = segmentMap[seg];
    return mapped ? `/${mapped[lang]}` : `/${seg}`;
  });
  if (lang === 'es') return translated || '/';
  return `/en${translated}`;
}
