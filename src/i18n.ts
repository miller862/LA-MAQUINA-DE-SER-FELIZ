// All static UI strings. Add keys here for both languages.

export const ui = {
  es: {
    'nav.blog':           'Blog',
    'nav.pensamiento':    'Pensamiento',
    'nav.datos':          'Ciencia de Datos',
    'nav.podcast':        'Podcast',
    'nav.sobre':          'Sobre mí',
    'home.subtitle':      'Politólogo · Data Scientist',
    'home.intro':         'Un lugar para pensar con otros. Y si incomoda, mejor',
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
    'podcast.name':       'La Máquina de Ser Feliz',
    'podcast.tagline':    'Un podcast sobre política, ideas y la vida examinada.',
    'podcast.intro':      'Conversaciones largas y sin apuro sobre lo que nos toca pensar: la cosa pública, la filosofía cotidiana y las preguntas que no se dejan responder rápido.',
    'podcast.soon.label': 'Primer episodio en camino',
    'podcast.soon.text':  'Estoy preparando los primeros episodios. Mientras tanto, podés seguirme en LinkedIn para enterarte cuando salga.',
    'podcast.episodes':   'Episodios',
  },
  en: {
    'nav.blog':           'Blog',
    'nav.pensamiento':    'Thinking',
    'nav.datos':          'Data Science',
    'nav.podcast':        'Podcast',
    'nav.sobre':          'About',
    'home.subtitle':      'Political Scientist · Data Scientist',
    'home.intro':         "A place to think with others. And if it's uncomfortable, even better.",
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
    'podcast.name':       'La Máquina de Ser Feliz',
    'podcast.tagline':    'A podcast on politics, ideas, and the examined life.',
    'podcast.intro':      'Long, unhurried conversations about what we are called to think through: public life, everyday philosophy, and the questions that resist quick answers.',
    'podcast.soon.label': 'First episode on its way',
    'podcast.soon.text':  'I am putting together the first episodes. In the meantime, follow me on LinkedIn to hear when it drops.',
    'podcast.episodes':   'Episodes',
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
  const clean = path.replace(/^\/(es|en)/, '') || '/';
  const translated = clean.replace(/^\/([^/]+)/, (_, seg) => {
    const mapped = segmentMap[seg];
    return mapped ? `/${mapped[lang]}` : `/${seg}`;
  });
  if (lang === 'es') return translated || '/';
  return `/en${translated}`;
}
