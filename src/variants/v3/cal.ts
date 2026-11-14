// Calendar arithmetic for the Calendar Wall. A day is an Aarhus calendar day
// written as a 'YYYY-MM-DD' key, a month a 'YYYY-MM' key. Keys compare as strings.
import type { ADEvent } from '@lib/event'
import { dayNumber, monthShort, weekdayShort } from '../shared'

const CPH = 'Europe/Copenhagen'

/** The Aarhus calendar day of an instant: "2026-11-19". */
export const dayKey = (d: Date | number) => new Date(d).toLocaleDateString('en-CA', { timeZone: CPH })

// Noon UTC keeps plain calendar arithmetic clear of daylight-saving edges.
const noon = (key: string) => new Date(key + 'T12:00:00Z')
const keyOf = (d: Date) => d.toISOString().slice(0, 10)

export function addDays(key: string, n: number): string {
  const d = noon(key)
  d.setUTCDate(d.getUTCDate() + n)
  return keyOf(d)
}

export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1 + n, 1, 12)).toISOString().slice(0, 7)
}

/** Monday 0 … Sunday 6 */
export const weekday = (key: string) => (noon(key).getUTCDay() + 6) % 7

/** ISO 8601 week number, the one Danish calendars print: 19 Nov 2026 → 47. */
export function isoWeek(key: string): number {
  const thursday = addDays(key, 3 - weekday(key))
  const jan4 = `${thursday.slice(0, 4)}-01-04`
  const firstThursday = addDays(jan4, 3 - weekday(jan4))
  return 1 + Math.round((noon(thursday).valueOf() - noon(firstThursday).valueOf()) / (7 * 864e5))
}

/** "November 2026" */
export const monthLabel = (month: string) =>
  noon(month + '-15').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "Thursday 19 November" */
export const dayLabel = (key: string) =>
  noon(key).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

/** "Thu 19 Nov 2026" */
export const dayLabelShort = (key: string) =>
  noon(key)
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .replace(',', '')
    .replace('Sept', 'Sep')

export interface Day {
  key: string
  day: number
  /** false for the days of the previous / next month that fill out the first and last week */
  inMonth: boolean
}

/** The Mon–Sun weeks that cover a month, with their ISO week numbers. */
export function monthWeeks(month: string): { week: number; days: Day[] }[] {
  const first = month + '-01'
  const weeks: { week: number; days: Day[] }[] = []
  for (let monday = addDays(first, -weekday(first)); monday.slice(0, 7) <= month; monday = addDays(monday, 7)) {
    const days = Array.from({ length: 7 }, (_, i) => {
      const key = addDays(monday, i)
      return { key, day: Number(key.slice(8)), inMonth: key.slice(0, 7) === month }
    })
    weeks.push({ week: isoWeek(monday), days })
  }
  return weeks
}

/** Every calendar day an event covers (one, unless it has an endDate). */
export function eventDays(event: ADEvent): string[] {
  const days = [dayKey(event.start)]
  const last = dayKey(event.end)
  while (days.at(-1)! < last && days.length < 62) days.push(addDays(days.at(-1)!, 1))
  return days
}

/** The one date line every event row uses: "Thu 19 Nov · 18:00" or "Sat 10 Apr · time TBA". */
export const dateLine = (event: ADEvent) =>
  `${weekdayShort(event.start)} ${dayNumber(event.start)} ${monthShort(event.start)} · ${event.data.startTime ?? 'time TBA'}`

/** For `<time datetime>`: the exact start when the time is known, otherwise just the day. */
export const datetimeOf = (event: ADEvent) => (event.data.startTime ? event.start.toISOString() : dayKey(event.start))

/** A title short enough for a calendar cell: "Go AAR: Level up your testing" → "Go AAR". */
export function shortTitle(title: string): string {
  const head = title.split(/\s[—–]\s|:\s/)[0]
  return head.length >= 4 ? head : title
}

/** "Rust Aarhus at EIVA", or "Rust Aarhus, venue TBA". */
export const hostLine = (event: ADEvent) =>
  event.data.venue
    ? `${event.organizer.data.name} at ${event.data.venue.title}`
    : `${event.organizer.data.name}, venue TBA`
