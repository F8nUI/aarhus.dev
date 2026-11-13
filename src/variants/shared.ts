// Helpers every design variant can use. Variants get their data from these and
// from @lib/event + @lib/topics; they never read content files directly.
import type { ADEvent } from '@lib/event'
import { relativeLabel, whenTags } from './when'

export { formatLong, formatMonth, formatShort } from '@lib/event'
export { topicColor, topicName } from '@lib/topics'

const CPH = 'Europe/Copenhagen'
const SITE = 'https://aarhus.dev'

/**
 * Spread onto the root element of every event item: `<li {...eventAttrs(event)}>`.
 * The runtime re-tags it on every visit (data-when) — see README.md in this folder
 * for how buckets, groups, counts and data-rel use that.
 */
export function eventAttrs(event: ADEvent) {
  return {
    'data-id': event.id,
    'data-start': event.start.toISOString(),
    'data-end': event.end.toISOString(),
    'data-when': whenTags(event.start.valueOf(), event.end.valueOf(), Date.now()),
  }
}

/** Relative label at build time — put it in a `<span data-rel>` and the runtime keeps it current. */
export function relativeAtBuild(event: ADEvent): string {
  return relativeLabel(event.start.valueOf(), event.end.valueOf(), Date.now())
}

const part = (d: Date, options: Intl.DateTimeFormatOptions, locale = 'en-GB') =>
  d.toLocaleString(locale, { timeZone: CPH, ...options })

/** "19" */
export const dayNumber = (d: Date) => part(d, { day: 'numeric' })
/** "Thu" */
export const weekdayShort = (d: Date) => part(d, { weekday: 'short' })
/** "Thursday" */
export const weekdayLong = (d: Date) => part(d, { weekday: 'long' })
/** "Nov" */
export const monthShort = (d: Date) => part(d, { month: 'short' }).replace('Sept', 'Sep')
/** "November" */
export const monthLong = (d: Date) => part(d, { month: 'long' })
/** "2026" */
export const yearOf = (d: Date) => part(d, { year: 'numeric' })

/** "17:00–19:00", "from 17:00", or "" when the time isn't announced. */
export function timeRange(event: ADEvent): string {
  const { startTime, endTime } = event.data
  if (startTime && endTime) return `${startTime}–${endTime}`
  if (startTime) return `from ${startTime}`
  return ''
}

/** "2026-W47" style key and a label like "17–23 Nov" for grouping by week. */
export function weekOf(d: Date): { key: string; label: string } {
  const day = new Date(part(d, { year: 'numeric', month: '2-digit', day: '2-digit' }, 'en-CA') + 'T12:00:00Z')
  const monday = new Date(day)
  monday.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7))
  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)
  const fmt = (x: Date) => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  const label =
    monday.getUTCMonth() === sunday.getUTCMonth()
      ? `${monday.getUTCDate()}–${fmt(sunday)}`
      : `${fmt(monday)} – ${fmt(sunday)}`
  return { key: monday.toISOString().slice(0, 10), label: label.replace('Sept', 'Sep') }
}

/** Group events (already sorted) by a key, keeping order. */
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

/** Link to the venue on a map, or undefined when the venue is TBA. */
export function mapUrl(event: ADEvent): string | undefined {
  const v = event.data.venue
  if (!v) return undefined
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.title}, ${v.address}`)}`
}

// --- Calendar -------------------------------------------------------------

const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsDay = (d: Date) => part(d, { year: 'numeric', month: '2-digit', day: '2-digit' }, 'en-CA').replace(/-/g, '')
const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
const fold = (line: string) => line.match(/.{1,73}/g)!.join('\r\n ')

function icsEvent(event: ADEvent): string[] {
  const allDay = !event.data.startTime
  const next = new Date(event.end.valueOf() + 864e5)
  const v = event.data.venue
  return [
    'BEGIN:VEVENT',
    `UID:${event.id.replace('/', '-')}@aarhus.dev`,
    `DTSTAMP:${icsStamp(new Date())}`,
    allDay ? `DTSTART;VALUE=DATE:${icsDay(event.start)}` : `DTSTART:${icsStamp(event.start)}`,
    allDay ? `DTEND;VALUE=DATE:${icsDay(next)}` : `DTEND:${icsStamp(event.end)}`,
    `SUMMARY:${icsEscape(event.data.title)}`,
    ...(v ? [`LOCATION:${icsEscape(`${v.title}, ${v.address}`)}`] : []),
    `URL:${SITE}${event.url}`,
    `DESCRIPTION:${icsEscape(`${event.organizer.data.name} · ${event.data.learnMoreURL}`)}`,
    'END:VEVENT',
  ]
}

/** A whole .ics calendar (for /calendar.ics). */
export function icsCalendar(events: ADEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//aarhus.dev//events//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:aarhus.dev',
    ...events.flatMap(icsEvent),
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

/** A download link for one event: `<a href={icsHref(event)} download={...}>`. */
export function icsHref(event: ADEvent): string {
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsCalendar([event]))
}

/** File name to pair with icsHref: "talk-night-eiva-26-nov.ics". */
export const icsFileName = (event: ADEvent) => `${event.id.split('/')[1]}.ics`

/** "Add to Google Calendar" link. */
export function googleCalendarUrl(event: ADEvent): string {
  const allDay = !event.data.startTime
  const dates = allDay
    ? `${icsDay(event.start)}/${icsDay(new Date(event.end.valueOf() + 864e5))}`
    : `${icsStamp(event.start)}/${icsStamp(event.end)}`
  const v = event.data.venue
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.data.title,
    dates,
    details: `${event.data.learnMoreURL}\n\n${SITE}${event.url}`,
    ...(v ? { location: `${v.title}, ${v.address}` } : {}),
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

/** Subscribe to every event: webcal link and plain https link. */
export const calendarFeed = { webcal: 'webcal://aarhus.dev/calendar.ics', https: `${SITE}/calendar.ics` }

/** "meetup.com" — for a button that names where it goes: "Sign up on meetup.com →". */
export function linkHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}

/** Where anyone can propose a fix to this event's file on GitHub. */
export const editUrl = (event: ADEvent) =>
  `https://github.com/f8nui/aarhus.dev/edit/main/src/content/event/${event.id}.md`
