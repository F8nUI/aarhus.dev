// Formatting and small helpers for the components: date parts in Aarhus time (in
// English or Danish), the attributes the browser re-tags on every visit, and the
// featured posters' colors.
import type { ADEvent } from '@lib/event'
import { t, type Lang } from '@lib/i18n'
import { topicColor } from '@lib/topics'
import { relativeLabel, whenTags } from './when'

const CPH = 'Europe/Copenhagen'

/**
 * Spread onto the root element of every event item: `<li {...eventAttrs(event)}>`.
 * RuntimeBody re-tags data-when on every visit; see agents.md for how the board's
 * sections use it.
 */
export function eventAttrs(event: ADEvent) {
  return {
    'data-id': event.id,
    'data-start': event.start.toISOString(),
    'data-end': event.end.toISOString(),
    'data-when': whenTags(event.start.valueOf(), event.end.valueOf(), Date.now()),
  }
}

/** Relative label at build time: put it in a `<span data-rel>` and RuntimeBody keeps it current. */
export function relativeAtBuild(event: ADEvent, lang: Lang = 'en'): string {
  return relativeLabel(event.start.valueOf(), event.end.valueOf(), Date.now(), lang)
}

// --- Dates, in Aarhus time ---------------------------------------------------

const part = (d: Date, options: Intl.DateTimeFormatOptions, locale = 'en-GB') =>
  d.toLocaleString(locale, { timeZone: CPH, ...options })

// Danish names are spelled out rather than taken from Intl, which abbreviates them
// unevenly ("tors.", "nov.") and would throw the board's date column out of line.
const DA_WEEKDAYS: Record<string, string> = {
  Mon: 'man',
  Tue: 'tir',
  Wed: 'ons',
  Thu: 'tor',
  Fri: 'fre',
  Sat: 'lør',
  Sun: 'søn',
}
const DA_MONTHS = 'januar februar marts april maj juni juli august september oktober november december'.split(' ')
const monthIndex = (d: Date) => Number(part(d, { month: 'numeric' })) - 1

/** "19" */
export const dayNumber = (d: Date) => part(d, { day: 'numeric' })
/** "Thu"; "tor" */
export const weekdayShort = (d: Date, lang: Lang = 'en') =>
  lang === 'da' ? DA_WEEKDAYS[part(d, { weekday: 'short' })] : part(d, { weekday: 'short' })
/** "Nov"; "nov" */
export const monthShort = (d: Date, lang: Lang = 'en') =>
  lang === 'da' ? DA_MONTHS[monthIndex(d)].slice(0, 3) : part(d, { month: 'short' }).replace('Sept', 'Sep')
/** "November"; "november" */
export const monthLong = (d: Date, lang: Lang = 'en') =>
  lang === 'da' ? DA_MONTHS[monthIndex(d)] : part(d, { month: 'long' })
/** "2026" */
export const yearOf = (d: Date) => part(d, { year: 'numeric' })
/** "December", or "January 2027" when it isn't this year: a board section's heading. */
export function monthTitle(d: Date, lang: Lang = 'en'): string {
  const month = monthLong(d, lang)
  const title = month.charAt(0).toUpperCase() + month.slice(1)
  return yearOf(d) === yearOf(new Date()) ? title : `${title} ${yearOf(d)}`
}

const FIGURE_SPACE = ' '

/**
 * "Thu 19 Nov", with single-digit days padded so the month column lines up: "Fri  4 Dec".
 * Danish: "tor 19. nov".
 */
export function boardDate(event: ADEvent, lang: Lang = 'en'): string {
  const d = event.start
  const day = dayNumber(d).padStart(2, FIGURE_SPACE)
  return `${weekdayShort(d, lang)} ${lang === 'da' ? `${day}.` : day} ${monthShort(d, lang)}`
}

/** The value for `<time datetime>`: the exact start, or just the day when the time isn't announced. */
export function machineDate(event: ADEvent): string {
  if (event.data.startTime) return event.start.toISOString()
  return event.start.toLocaleDateString('en-CA', { timeZone: CPH })
}

/** "17:00–19:00", "from 17:00" ("fra 17:00"), or "" when the time isn't announced. */
export function timeRange(event: ADEvent, lang: Lang = 'en'): string {
  const { startTime, endTime } = event.data
  if (startTime && endTime) return `${startTime}–${endTime}`
  if (startTime) return t(lang).fromTime(startTime)
  return ''
}

/** "Tonight" for an evening start, "Today" otherwise: the status while an event is later today. */
export function todayWord(event: ADEvent, lang: Lang = 'en'): string {
  const start = event.data.startTime
  return start && start >= '17:00' ? t(lang).tonight : t(lang).todayStatus
}

// --- Lists -----------------------------------------------------------------

/** Group items (already sorted) by a key, keeping order. */
export function groupBy<T>(items: T[], key: (item: T) => string): { key: string; items: T[] }[] {
  const groups: { key: string; items: T[] }[] = []
  for (const item of items) {
    const k = key(item)
    const last = groups.at(-1)
    if (last?.key === k) last.items.push(item)
    else groups.push({ key: k, items: [item] })
  }
  return groups
}

/**
 * The featured events: highlighted ones that hadn't ended at build time, soonest
 * first. Which of them is still to come is decided in the browser.
 */
export function featuredEvents(events: ADEvent[]): ADEvent[] {
  const now = Date.now()
  return events.filter((e) => e.data.highlight && e.end.valueOf() >= now)
}

// --- Places and links -------------------------------------------------------

/** Link to the venue on a map, or undefined when the venue is TBA. */
export function mapUrl(event: ADEvent): string | undefined {
  const v = event.data.venue
  if (!v) return undefined
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.title}, ${v.address}`)}`
}

/**
 * The town, when the venue is outside Aarhus: the "destination" a board would show.
 * "Niels Bohrs Vej 17, 8660 Skanderborg" → "Skanderborg"; anything in Aarhus → undefined.
 */
export function townOutsideAarhus(event: ADEvent): string | undefined {
  const address = event.data.venue?.address
  if (!address) return undefined
  const last = address.split(',').at(-1)!.trim().replace(/^\d{4}\s*/, '')
  return /a+rhus|århus/i.test(last) ? undefined : last
}

/** "meetup.com", for a button that names where it goes: "Sign up on meetup.com →". */
export function linkHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}

/** Where anyone can propose a fix to this event's file on GitHub. */
export const editUrl = (event: ADEvent) =>
  `https://github.com/f8nui/aarhus.dev/edit/main/src/content/event/${event.id}.md`

// --- Featured posters --------------------------------------------------------

/**
 * Inline style that gives a poster its topic's color (--topic). The poster's styles
 * make its background (--p) and the ink on it (--p-on) from that, per theme; in light,
 * the color itself with white, which the topic colors are chosen dark enough for
 * (src/lib/topics.ts).
 */
export function topicStyle(topic: string): string {
  return `--topic: ${topicColor(topic)}`
}

/**
 * How big a title can be set: short titles go big, long ones smaller, so every
 * poster's headline fills about the same block.
 */
export function titleFit(title: string): 'xs' | 's' | 'm' | 'l' {
  const n = title.length
  if (n <= 13) return 'xs'
  if (n <= 22) return 's'
  if (n <= 40) return 'm'
  return 'l'
}
