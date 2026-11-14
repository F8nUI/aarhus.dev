// What the event page's small parts show, worked out once: the calendar links and the
// edit link.
import type { ADEvent } from '@lib/event'
import { googleCalendarUrl, icsFileName, icsHref } from '@lib/calendar'
import { editUrl } from '@lib/format'

export function eventFacts(event: ADEvent) {
  return {
    ics: { href: icsHref(event), file: icsFileName(event) },
    google: googleCalendarUrl(event),
    edit: editUrl(event),
  }
}

export type EventFacts = ReturnType<typeof eventFacts>
