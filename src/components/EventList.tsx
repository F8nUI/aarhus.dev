import type { ComponentChildren } from 'preact'

interface EventListProps {
  events: ADEvent[]
}

export default function EventList({ events }: EventListProps) {
  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.data.date) >= now)
  const pastEvents = events.filter((e) => new Date(e.data.date) < now)

  return (
    <div>
      <Section title="Upcoming Events" events={upcomingEvents} />
      <Section title="Past Events" events={pastEvents} />
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
          {event.data.title}
        </a>
      ))}
    </section>
  )
}
