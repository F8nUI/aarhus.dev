import { getCollection, getEntry, type CollectionEntry } from 'astro:content'
import type { Lang } from './i18n'

export type ADEvent = CollectionEntry<'events'> & {
  topic: string
  url: string
  start: Date
  end: Date
  organizer: CollectionEntry<'organizers'>
}

const CPH = 'Europe/Copenhagen'

// The folder an event sits in is its topic: `rust/talk-night` → `rust`.
const topicOf = (event: CollectionEntry<'events'>) => event.id.split('/')[0]

/** All events, or one topic's, oldest first. */
export async function getEvents(topic?: string): Promise<ADEvent[]> {
  const entries = await getCollection('events', (e) => !topic || topicOf(e) === topic)
  const events = await Promise.all(entries.map(parseEvent))
  return events.sort((a, b) => a.start.valueOf() - b.start.valueOf())
}

export async function getTopics(): Promise<string[]> {
  const events = await getCollection('events')
  return [...new Set(events.map(topicOf))].sort().reverse()
}

export async function parseEvent(event: CollectionEntry<'events'>): Promise<ADEvent> {
  const { date, endDate, startTime, endTime } = event.data
  return {
    ...event,
    topic: topicOf(event),
    url: `/${event.id}`,
    start: cphTime(date, startTime ?? '00:00'),
    // No end time given: the event counts as running until the end of its day.
    end: cphTime(endDate ?? date, endTime ?? '23:59'),
    organizer: await getEntry(event.data.organizer),
  }
}

/** "tue, 18 aug · 17:00" — a row in the event lists. */
export function formatShort(event: ADEvent): string {
  const weekday = event.start.toLocaleDateString('en-GB', { weekday: 'short', timeZone: CPH })
  const dayMonth = event.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: CPH })
  const date = `${weekday}, ${dayMonth}`.toLowerCase()
  return event.data.startTime ? `${date} · ${event.data.startTime}` : date
}

/** "Tuesday 18 August 2026" and "17:00 – 19:00"; in Danish "tirsdag den 18. august 2026". */
export function formatLong(event: ADEvent, lang: Lang = 'en'): { date: string; time: string } {
  const { startTime, endTime } = event.data
  const da = lang === 'da'
  const day = (d: Date) =>
    d.toLocaleDateString(da ? 'da-DK' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: CPH,
    })

  const startDay = day(event.start)
  const endDay = day(event.end)
  const date = startDay === endDay ? startDay : `${startDay} – ${endDay}`

  let time = da ? 'tid følger' : 'time TBA'
  if (startTime && endTime) time = `${startTime} – ${endTime}`
  else if (startTime) time = `${da ? 'fra' : 'from'} ${startTime}`

  return { date, time }
}

/** "August 2026" */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: CPH })
}

const cphOffsetFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: CPH,
  timeZoneName: 'longOffset',
})

// A calendar date plus an Aarhus wall-clock time, as an exact instant.
function cphTime(date: Date, time: string): Date {
  const dateStr = date.toISOString().split('T')[0]
  // Copenhagen's UTC offset on this date (+01:00 in winter, +02:00 in summer)
  const noonUtc = new Date(`${dateStr}T12:00:00Z`)
  const tzPart = cphOffsetFormatter.formatToParts(noonUtc).find((p) => p.type === 'timeZoneName')
  const offset = tzPart?.value.replace('GMT', '') || '+01:00'
  return new Date(`${dateStr}T${time}:00${offset}`)
}
