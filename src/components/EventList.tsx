import type { ADEvent } from '@lib/event'
import EventHeader from './EventHeader'

interface EventListProps {
  events: ADEvent[]
  filteringByTopic: boolean
  pastOnly?: boolean
  topic?: string
}

export default function EventList({ events, filteringByTopic, pastOnly, topic }: EventListProps) {
  const { now, today, upcoming, past } = groupEvents(events)

  if (pastOnly) {
    const sorted = past.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    return (
      <div>
        <EventItems events={sorted} filteringByTopic={filteringByTopic} />
      </div>
    )
  }

  const hasActive = now.length + today.length + upcoming.length > 0

  return (
    <div class="flex flex-col space-y-8">
      <Section title="Happening right now" filteringByTopic={filteringByTopic} events={now} />
      <Section title="Today" filteringByTopic={filteringByTopic} events={today} />
      <Section title="Upcoming" filteringByTopic={filteringByTopic} events={upcoming} showHeader={now.length > 0 || today.length > 0} />
      {!hasActive && (
        <div class="py-2 px-3 -mx-3 flex items-start gap-2.5" style={{ color: 'var(--color-text-muted)' }}>
          <span class="w-2 h-2 rounded-full shrink-0 mt-[0.45em]" style={{ backgroundColor: 'var(--color-border)' }} />
          <div>
            <p>No upcoming events yet.</p>
            <p class="text-sm mt-1">
              Know something coming up?{' '}
              <a class="underline" href="/add-event">Add an event</a>
            </p>
          </div>
        </div>
      )}
      <div style={past.length === 0 ? { display: 'none' } : undefined}>
        <div class="h-px mb-4" style={{ backgroundColor: 'var(--color-border)', opacity: 0.7 }}></div>
        <a
          class="no-underline! block py-2 px-3 -mx-3 rounded-sm hover-row flex items-start gap-2.5"
          style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
          href={topic ? `/past/${topic}` : '/past'}
        >
          <span class="w-2 h-2 rounded-full shrink-0 mt-[0.45em]" style={{ backgroundColor: 'var(--color-border)' }} />
          <span>Past events ({past.length})</span>
        </a>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  events: ADEvent[]
  filteringByTopic: boolean
  showHeader?: boolean
}

const EventItems = ({ events, filteringByTopic }: { events: ADEvent[]; filteringByTopic: boolean }) => {
  const grouped = groupByMonth(events)

  return (
    <>
      {grouped.map(({ label, events: monthEvents }) => (
        <div class="mt-3 first:mt-0">
          <div
            class="flex items-center gap-2 mb-1"
            style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}
          >
            <span class="h-px w-[18px] shrink-0" style={{ backgroundColor: 'var(--color-border)' }}></span>
            <span class="text-xs uppercase tracking-wide shrink-0">{label}</span>
            <span class="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }}></span>
          </div>
          {monthEvents.map((event) => (
            <a class="no-underline! block group" href={event.id}>
              <EventHeader isEventPage={false} event={event} languageBadge={!filteringByTopic} />
            </a>
          ))}
        </div>
      ))}
    </>
  )
}

const Section = ({ title, events, filteringByTopic, showHeader = true }: SectionProps) => {
  const empty = events.length === 0

  return (
    <div style={empty ? { display: 'none' } : undefined}>
      {showHeader && (
        <h2
          class="text-sm flex items-center mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span class="shrink-0 w-[18px] text-left">//</span>
          <span class="shrink-0">{title.toLowerCase()}</span>
          <span class="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }}></span>
        </h2>
      )}
      <EventItems events={events} filteringByTopic={filteringByTopic} />
    </div>
  )
}

function nowInCph(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }))
}

function groupEvents(events: ADEvent[]): {
  now: ADEvent[]
  today: ADEvent[]
  upcoming: ADEvent[]
  past: ADEvent[]
} {
  const currentTime = nowInCph()
  const todayStart = new Date(currentTime)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(currentTime)
  todayEnd.setHours(23, 59, 59, 999)

  const result = {
    now: [] as ADEvent[],
    today: [] as ADEvent[],
    upcoming: [] as ADEvent[],
    past: [] as ADEvent[],
  }

  for (const event of events) {
    const start = event.startDate
    const end = event.endDate

    if (start <= currentTime && end >= currentTime) {
      result.now.push(event)
    } else if (end < currentTime) {
      result.past.push(event)
    } else if (start >= todayStart && start <= todayEnd) {
      result.today.push(event)
    } else {
      result.upcoming.push(event)
    }
  }

  result.upcoming.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  return result
}

function groupByMonth(events: ADEvent[]): { label: string; events: ADEvent[] }[] {
  const groups: { label: string; events: ADEvent[] }[] = []
  for (const event of events) {
    const label = event.startDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Copenhagen',
    })
    const last = groups[groups.length - 1]
    if (last && last.label === label) {
      last.events.push(event)
    } else {
      groups.push({ label, events: [event] })
    }
  }
  return groups
}
