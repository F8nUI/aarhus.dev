// Calendar files and links: the /calendar.ics feed, a one-event download, and
// "Add to Google Calendar".
import type { ADEvent } from '@lib/event'

const CPH = 'Europe/Copenhagen'
const SITE = 'https://aarhus.dev'

const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsDay = (d: Date) =>
  d.toLocaleDateString('en-CA', { timeZone: CPH, year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '')
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

/** A download link for one event: `<a href={icsHref(event)} download={icsFileName(event)}>`. */
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
