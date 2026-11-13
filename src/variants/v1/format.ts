// Small formatting helpers for the Departure Board variant.
import type { ADEvent } from '@lib/event'
import { dayNumber, monthShort, weekdayShort } from '../shared'

const FIGURE_SPACE = ' '

/** "Thu 19 Nov", with single-digit days padded so the month column lines up: "Fri  4 Dec". */
export function boardDate(event: ADEvent): string {
  const d = event.start
  return `${weekdayShort(d)} ${dayNumber(d).padStart(2, FIGURE_SPACE)} ${monthShort(d)}`
}

/** The value for `<time datetime>`: the exact start, or just the day when the time isn't announced. */
export function machineDate(event: ADEvent): string {
  if (event.data.startTime) return event.start.toISOString()
  return event.start.toLocaleDateString('en-CA', { timeZone: 'Europe/Copenhagen' })
}

/** "Tonight" for an evening start, "Today" otherwise — the status while an event is later today. */
export function todayWord(event: ADEvent): string {
  const t = event.data.startTime
  return t && t >= '17:00' ? 'Tonight' : 'Today'
}

/**
 * The town, when the venue is outside Aarhus — the "destination" a board would show.
 * "Niels Bohrs Vej 17, 8660 Skanderborg" → "Skanderborg"; anything in Aarhus → undefined.
 */
export function townOutsideAarhus(event: ADEvent): string | undefined {
  const address = event.data.venue?.address
  if (!address) return undefined
  const last = address.split(',').at(-1)!.trim().replace(/^\d{4}\s*/, '')
  return /a+rhus|århus/i.test(last) ? undefined : last
}
