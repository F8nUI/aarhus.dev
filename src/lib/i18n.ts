// The site's two languages. English pages live at /…, Danish ones at /da/… (thin
// wrappers in src/pages/da/ around the same pages). A page knows its language from its
// address: `const w = t(langOf(Astro.url))`, then `w.today`, `w.past(what)`.
// Event and organizer descriptions stay in the language they were written in; only the
// site around them is translated. The About and Add event texts have Danish versions
// in src/content/da/. Dates: src/lib/format.ts; "in 5 days": src/lib/when.ts; topic
// names: src/lib/topics.ts.

export type Lang = 'en' | 'da'

/** Each language's name, in itself: for the switch between them. */
export const LANG_NAMES: Record<Lang, string> = { en: 'English', da: 'Dansk' }

/** The site's address, for links that must be absolute (the alternate-language links). */
export const SITE = 'https://aarhus.dev'

/** The language of a page, from its address: /da/… is Danish. */
export function langOf(url: URL): Lang {
  return /^\/da(\/|$)/.test(url.pathname) ? 'da' : 'en'
}

/** The page's path without its language (or a trailing slash): '/da/rust/' → '/rust', '/da/' → '/'. */
export function basePath(url: URL): string {
  return url.pathname.replace(/^\/da(?=\/|$)/, '').replace(/\/$/, '') || '/'
}

/** A path on the site, in a language: ('da', '/rust') → '/da/rust', ('da', '/') → '/da/'. */
export function localPath(lang: Lang, path: string): string {
  if (lang === 'en') return path
  return path === '/' ? '/da/' : `/da${path}`
}

const en = {
  // the frame (Layout.astro)
  siteTitle: 'Aarhus Developer Events & Meetups – aarhus.dev',
  siteDescription:
    'A timetable of developer events and tech meetups in Aarhus, Denmark. Find Swift, Rust, JavaScript, Ruby and more community gatherings.',
  tagline: 'tech meetups in Aarhus',
  subscribe: 'Subscribe to the calendar',
  addAnEvent: 'Add an event',
  topics: 'Topics',
  allTopics: 'All topics',
  footAbout: 'is a community timetable of tech events in Aarhus, Denmark.',
  footSite: 'Site',
  footFollow: 'Follow',
  about: 'About',
  addEvent: 'Add event',
  subscribeLink: 'Subscribe to calendar',
  calendarUrl: 'Calendar URL (.ics)',
  calendarUrlHint: "The calendar feed's web address, for apps that ask for a URL",
  rssFeed: 'RSS feed',
  rssHint: 'Every upcoming event, for your feed reader',
  rssName: 'aarhus.dev: upcoming events',
  themeSwitch: 'Switch between light and dark',

  // the lists (Board.astro, OrganizerEvents.astro)
  events: 'events',
  today: 'Today',
  tomorrow: 'Tomorrow',
  thisWeek: 'This week',
  nextWeek: 'Next week',
  cols: { day: 'Day', time: 'Time', topic: 'Topic', event: 'Event', venue: 'Venue', status: 'Status' },
  pastOf: (what: string) => `Past ${what}`,
  upcomingOf: (what: string) => `Upcoming ${what}`,
  archiveEmpty: 'Nothing in the archive yet.',
  archiveEmptyHint: 'Events move here the day after they end.',
  seeUpcoming: "See what's coming up",
  boardEmpty: (what: string) => `No ${what} on the board yet.`,
  boardEmptyHint: 'Know of one coming up?',
  comingUp: 'Coming up',
  nothingComingUp: 'Nothing coming up yet.',
  knowOfOne: 'Know of one?',
  pastEvents: 'Past events',

  // a row and its status (Row.astro, Status.astro)
  tba: 'TBA',
  venueTba: 'Venue TBA',
  timeTba: 'Time TBA',
  now: 'Now',
  todayStatus: 'Today',
  tonight: 'Tonight',
  ended: 'Ended',
  fromTime: (time: string) => `from ${time}`,
  untilTime: (time: string) => `until ${time}`,

  // the posters (Featured.astro, FeaturedPoster.astro)
  featured: 'Featured events',
  previousFeatured: 'Previous featured event',
  nextFeatured: 'Next featured event',
  pause: 'Pause',
  play: 'Play',
  where: 'Where',
  organizer: 'Organizer',
  signUp: 'Sign up',
  eventPage: 'Event page',
  onHost: (host: string) => `on ${host}`,

  // an event's page (EventPage.astro and event/)
  hasEnded: 'This event has ended.',
  addToCalendar: 'Add to calendar (.ics)',
  googleCalendar: 'Google Calendar',
  fixPrompt: 'Something wrong or missing?',
  fixLink: 'Edit on GitHub',

  // page titles and descriptions (src/pages/)
  inAarhus: (what: string) => `${what} in Aarhus`,
  topicDescription: (what: string) =>
    `${what} in Aarhus, Denmark: what's coming up, with dates, venues and where to sign up`,
  pastTitle: 'Past Events',
  pastDescription: 'Past tech events and meetups in Aarhus, Denmark',
  pastHeading: 'past events in Aarhus',
  pastTopicTitle: (what: string) => `Past ${what} in Aarhus`,
  pastTopicDescription: (what: string) => `Past ${what} in Aarhus, Denmark`,
  pastTopicHeading: (what: string) => `past ${what} in Aarhus`,
  organizerDescription: (name: string) =>
    `Tech events by ${name} in Aarhus, Denmark: what's coming up and what's been`,
}

const da: typeof en = {
  siteTitle: 'Udvikler-events og tech-meetups i Aarhus – aarhus.dev',
  siteDescription:
    'En kalender over udvikler-events og tech-meetups i Aarhus. Find Swift, Rust, JavaScript, Ruby og mange flere fællesskaber.',
  tagline: 'tech-meetups i Aarhus',
  subscribe: 'Abonnér på kalenderen',
  addAnEvent: 'Tilføj et event',
  topics: 'Emner',
  allTopics: 'Alle emner',
  footAbout: 'er en fællesskabsdrevet kalender over tech-events i Aarhus.',
  footSite: 'Siden',
  footFollow: 'Følg med',
  about: 'Om',
  addEvent: 'Tilføj event',
  subscribeLink: 'Abonnér på kalenderen',
  calendarUrl: 'Kalender-URL (.ics)',
  calendarUrlHint: 'Kalenderens webadresse, til apps der beder om en URL',
  rssFeed: 'RSS-feed',
  rssHint: 'Alle kommende events, til din feedlæser',
  rssName: 'aarhus.dev: kommende events',
  themeSwitch: 'Skift mellem lyst og mørkt',

  events: 'events',
  today: 'I dag',
  tomorrow: 'I morgen',
  thisWeek: 'Denne uge',
  nextWeek: 'Næste uge',
  cols: { day: 'Dag', time: 'Tid', topic: 'Emne', event: 'Event', venue: 'Sted', status: 'Status' },
  pastOf: (what) => `Tidligere ${what}`,
  upcomingOf: (what) => `Kommende ${what}`,
  archiveEmpty: 'Intet i arkivet endnu.',
  archiveEmptyHint: 'Events flytter hertil dagen efter, de er slut.',
  seeUpcoming: 'Se, hvad der er på vej',
  boardEmpty: (what) => `Ingen ${what} på tavlen endnu.`,
  boardEmptyHint: 'Kender du et, der er på vej?',
  comingUp: 'Kommende',
  nothingComingUp: 'Intet på vej endnu.',
  knowOfOne: 'Kender du et?',
  pastEvents: 'Tidligere events',

  tba: 'TBA',
  venueTba: 'Sted følger',
  timeTba: 'Tid følger',
  now: 'Nu',
  todayStatus: 'I dag',
  tonight: 'I aften',
  ended: 'Slut',
  fromTime: (time) => `fra ${time}`,
  untilTime: (time) => `til ${time}`,

  featured: 'Fremhævede events',
  previousFeatured: 'Forrige fremhævede event',
  nextFeatured: 'Næste fremhævede event',
  pause: 'Pause',
  play: 'Afspil',
  where: 'Hvor',
  organizer: 'Arrangør',
  signUp: 'Tilmeld dig',
  eventPage: 'Eventside',
  onHost: (host) => `på ${host}`,

  hasEnded: 'Dette event er slut.',
  addToCalendar: 'Tilføj til kalender (.ics)',
  googleCalendar: 'Google Kalender',
  fixPrompt: 'Er der noget galt, eller mangler der noget?',
  fixLink: 'Ret det på GitHub',

  inAarhus: (what) => `${what} i Aarhus`,
  topicDescription: (what) => `${what} i Aarhus: hvad der er på vej, med datoer, steder og tilmelding`,
  pastTitle: 'Tidligere events',
  pastDescription: 'Tidligere tech-events og meetups i Aarhus',
  pastHeading: 'tidligere events i Aarhus',
  pastTopicTitle: (what) => `Tidligere ${what} i Aarhus`,
  pastTopicDescription: (what) => `Tidligere ${what} i Aarhus`,
  pastTopicHeading: (what) => `tidligere ${what} i Aarhus`,
  organizerDescription: (name) => `Tech-events fra ${name} i Aarhus: hvad der er på vej, og hvad der har været`,
}

const WORDS: Record<Lang, typeof en> = { en, da }

/** The site's words in a language. */
export function t(lang: Lang): typeof en {
  return WORDS[lang]
}
