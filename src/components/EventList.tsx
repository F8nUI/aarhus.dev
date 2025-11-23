interface EventListProps {
  events: ADEvent[]
}

export default function EventList({ events }: EventListProps) {
  const { now, today, upcoming, past } = groupEvents(events)

  return (
    <div>
      {now.length > 0 && <Section title="Happening right now" events={now} />}
      {today.length > 0 && <Section title="Today" events={today} />}
      <Section title="Upcoming Events" events={upcoming} />
      <Section title="Past Events" events={past} />
    </div>
  )
}

interface SectionProps {
  title: string
  events: ADEvent[]
}

const Section = ({ title, events }: SectionProps) => {
  return (
    <section class="flex flex-col">
      <h2 class="text-sm opacity-50">{title}</h2>
      {events.map((event) => (
        <a class="hover:underline" href={event.id}>
          <div class="flex space-x-2">
            <p>{event.data.title}</p>
            <p class="opacity-30">by {event.organizer.data.name}</p>
            <p>{event.startDateFormatted}</p>
          </div>
        </a>
      ))}
    </section>
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

  return result
}
