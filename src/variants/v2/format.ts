// Text helpers for the Weekly Issue variant: the dateline every list item uses,
// and the short venue line ("EIVA, Skanderborg").
import type { ADEvent } from '@lib/event'
import { dayNumber, monthShort, weekdayShort } from '../shared'

/** "Thu 19 Nov" */
export const dayLabel = (event: ADEvent) =>
  `${weekdayShort(event.start)} ${dayNumber(event.start)} ${monthShort(event.start)}`

/** "18:00", or "time TBA" when it isn't announced. */
export const startLabel = (event: ADEvent) => event.data.startTime ?? 'time TBA'

/**
 * The town from an address: "Niels Bohrs Vej 17, 8660 Skanderborg" → "Skanderborg".
 * Every part of Aarhus ("8000 Aarhus C", "Aarhus N") comes back as plain "Aarhus".
 */
export function townOf(address: string): string {
  const last = address.split(',').at(-1)!.trim().replace(/^\d{4}\s+/, '')
  return /^Aarhus\b/.test(last) ? 'Aarhus' : last
}

/** "EIVA, Skanderborg" — the town only when it isn't Aarhus, which goes without saying here. */
export function venueLine(event: ADEvent): string {
  const venue = event.data.venue
  if (!venue) return 'venue TBA'
  const town = townOf(venue.address)
  return town === 'Aarhus' ? venue.title : `${venue.title}, ${town}`
}
