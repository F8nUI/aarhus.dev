import EventHeader from './EventHeader'

interface EventListProps {
  events: ADEvent[]
  filteringByLanguage: boolean
}

export default function EventList({ events, filteringByLanguage }: EventListProps) {
  const { now, today, upcoming, past } = groupEvents(events)

  return (
    <div class="flex flex-col space-y-8">
      <Section title="Happening right now" filteringByLanguage={filteringByLanguage} events={now} />
      <Section title="Today" filteringByLanguage={filteringByLanguage} events={today} />
      <Section
        title="Upcoming Events"
        filteringByLanguage={filteringByLanguage}
        events={upcoming}
      />
      <Section title="Past Events" filteringByLanguage={filteringByLanguage} events={past} />
    </div>
  )
}

interface SectionProps {
  title: string
  events: ADEvent[]
  filteringByLanguage: boolean
}

const Section = ({ title, events, filteringByLanguage }: SectionProps) => {
  return (
    events.length > 0 && (
      <section class="flex flex-col space-y-2">
        <h2 class="text-sm opacity-50 relative flex items-center space-x-2">
          <span class="text-nowrap">{title}</span>
          <span class="h-px w-full bg-gray-300"></span>
        </h2>
        <div class="flex flex-col space-y-2">
          {events.map((event) => (
            <a class="no-underline! relative group" href={event.id}>
              <EventHeader isEventPage={false} event={event} languageBadge={!filteringByLanguage} />
            </a>
          ))}
        </div>
      </section>
    )
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
