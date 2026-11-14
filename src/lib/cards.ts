// Share cards: the picture a link to a page shows in Slack, LinkedIn, iMessage and the
// rest (og:image). Every page has one, in its language, built with the site as
// /og/<page>.png (src/pages/og/[...card].png.ts, drawn by src/lib/cardImage.ts):
//
// - an event: its poster, in its topic's color: title, date, place, organizer
// - a topic's list and its archive: the topic's color and "Rust events in Aarhus"
// - an organizer: their name and topics, on the dark board
// - the home page, the archive, About and Add event: the logo and the page's title
import { getCollection, getEntry } from 'astro:content'
import { getEvents, getTopics, type ADEvent } from '@lib/event'
import { localPath, t, type Lang } from '@lib/i18n'
import { topicEvents, topicEventsTitle } from '@lib/topics'

export type Card =
  | { kind: 'event'; lang: Lang; event: ADEvent }
  | { kind: 'topic'; lang: Lang; topic: string; title: string; url: string }
  | { kind: 'organizer'; lang: Lang; name: string; topics: string[]; url: string }
  | { kind: 'site'; lang: Lang; title: string; topics: string[]; url: string }

const LANGS: Lang[] = ['en', 'da']

/** The card's file for a page: ('da', '/rust') → '/og/da/rust.png', ('en', '/') → '/og/index.png'. */
export function cardPath(lang: Lang, path: string): string {
  const page = path === '/' ? 'index' : path.slice(1)
  return `/og/${lang === 'da' ? 'da/' : ''}${page}.png`
}

/** How a page's address reads on its card: "aarhus.dev/da/rust". */
const shown = (lang: Lang, path: string) => `aarhus.dev${localPath(lang, path)}`.replace(/\/$/, '')

/** Every page's card, for both languages: the routes of src/pages/og/[...card].png.ts. */
export async function cardPaths() {
  const events = await getEvents()
  const topics = await getTopics()
  const organizers = await getCollection('organizers')
  const cards: { path: string; card: Card }[] = []

  for (const lang of LANGS) {
    const w = t(lang)
    const site = (path: string, title: string) =>
      cards.push({ path, card: { kind: 'site', lang, title, topics, url: shown(lang, path) } })
    site('/', w.tagline)
    site('/past', w.pastHeading)
    for (const id of ['about', 'add-event']) {
      const entry = await getEntry('pages', lang === 'da' ? `da/${id}` : id)
      site(`/${id}`, entry!.data.title)
    }

    for (const topic of topics) {
      const card = (path: string, title: string): Card => ({ kind: 'topic', lang, topic, title, url: shown(lang, path) })
      cards.push({ path: `/${topic}`, card: card(`/${topic}`, w.inAarhus(topicEventsTitle(topic, lang))) })
      cards.push({ path: `/past/${topic}`, card: card(`/past/${topic}`, w.pastTopicTitle(topicEvents(topic, lang))) })
    }

    for (const event of events) {
      cards.push({ path: event.url, card: { kind: 'event', lang, event } })
    }

    for (const organizer of organizers) {
      const path = `/organizer/${organizer.id}`
      const theirs = [...new Set(events.filter((e) => e.organizer.id === organizer.id).map((e) => e.topic))]
      cards.push({ path, card: { kind: 'organizer', lang, name: organizer.data.name, topics: theirs, url: shown(lang, path) } })
    }
  }

  return cards.map(({ path, card }) => ({
    params: { card: cardPath(card.lang, path).replace(/^\/og\//, '').replace(/\.png$/, '') },
    props: { card },
  }))
}
