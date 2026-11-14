// Every event as one subscribable calendar: webcal://aarhus.dev/calendar.ics
import { getEvents } from '@lib/event'
import { icsCalendar } from '@lib/calendar'

export async function GET() {
  return new Response(icsCalendar(await getEvents()), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  })
}
