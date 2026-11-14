// Display name and color for each folder in src/content/event/, and optionally what
// to call its events when "<name> events" reads oddly ("dev conferences", not
// "Conference events"): it names the topic's page ("Dev conferences in Aarhus") and
// its archive ("Past dev conferences").
// `da` holds the Danish name and events phrase, where they differ from the English
// name and "<name>-events" (src/lib/i18n.ts).
// A folder without an entry still works: it shows its folder name and a neutral dot.
// Every color is dark enough for white text on it (at least 4.5:1): in light, the
// featured posters set their title, date and details in white on the topic's color.
// (Dark makes its own tints of it: FeaturedPoster.astro.)
import type { Lang } from './i18n'

type Topic = { name: string; color: string; events?: string; da?: { name?: string; events?: string } }

const TOPICS: Record<string, Topic> = {
  ai: { name: 'AI', color: '#b16002' },
  conference: {
    name: 'Conference',
    color: '#d92576',
    events: 'dev conferences',
    da: { name: 'Konference', events: 'udviklerkonferencer' },
  },
  devops: { name: 'DevOps', color: '#078379' },
  dotnet: { name: '.NET', color: '#512bd4' },
  go: { name: 'Go', color: '#087f9f' },
  js: { name: 'JavaScript', color: '#827406' },
  python: { name: 'Python', color: '#3776ab' },
  ruby: { name: 'Ruby', color: '#cc342d' },
  rust: { name: 'Rust', color: '#9d6849' },
  security: { name: 'Security', color: '#018639', da: { name: 'Sikkerhed', events: 'sikkerhedsevents' } },
  swift: { name: 'Swift', color: '#d93921' },
}

/** What to call the topic's events, mid-sentence: "Swift events", "dev conferences"; "Swift-events" in Danish. */
export function topicEvents(topic: string, lang: Lang = 'en'): string {
  if (lang === 'da') return TOPICS[topic]?.da?.events ?? `${topicName(topic, lang)}-events`
  return TOPICS[topic]?.events ?? `${topicName(topic)} events`
}

/** The same at the start of a sentence: "Dev conferences". */
export function topicEventsTitle(topic: string, lang: Lang = 'en'): string {
  const s = topicEvents(topic, lang)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function topicName(topic: string, lang: Lang = 'en'): string {
  if (lang === 'da' && TOPICS[topic]?.da?.name) return TOPICS[topic].da!.name!
  return TOPICS[topic]?.name ?? topic
}

export function topicColor(topic: string): string {
  return TOPICS[topic]?.color ?? 'var(--color-text-muted)'
}
