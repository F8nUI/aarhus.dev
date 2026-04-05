import { cn } from '@lib/cn'
import type { ADEvent } from '@lib/event'

interface EventHeaderProps {
  event: ADEvent
  isEventPage: boolean
  languageBadge: boolean
}

const topicColors: Record<string, string> = {
  swift: 'var(--color-topic-swift)',
  js: 'var(--color-topic-js)',
  rust: 'var(--color-topic-rust)',
  ruby: 'var(--color-topic-ruby)',
  dotnet: 'var(--color-topic-dotnet)',
  ai: 'var(--color-topic-ai)',
}

const CPH = 'Europe/Copenhagen'

function shortDate(date: Date): string {
  const weekday = date
    .toLocaleDateString('en-US', { weekday: 'short', timeZone: CPH })
    .toLowerCase()
  const dayMonth = date
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: CPH })
    .toLowerCase()
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: CPH,
  })
  return `${weekday}, ${dayMonth} \u00b7 ${time}`
}

export default function EventHeader({ event, isEventPage, languageBadge }: EventHeaderProps) {
  if (isEventPage) {
    return (
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold leading-tight">{event.data.title}</h1>
        <div class="mt-3 text-sm flex flex-col gap-1" style={{ color: 'var(--color-text-muted)' }}>
          <span>
            Organized by{' '}
            <a href={'/organizer/' + event.organizer.id}>{event.organizer.data.name}</a>
          </span>
          <p>
            {event.dateFormatted.date}, {event.dateFormatted.time}
          </p>
          <p>{event.data.venue.address}</p>
        </div>
        {event.data.learnMoreURL && (
          <a class="cta mt-4 text-sm" href={event.data.learnMoreURL}>
            Attend / Learn more &rarr;
          </a>
        )}
      </div>
    )
  }

  return (
    <div class="py-2 px-3 -mx-3 rounded-sm hover-row flex items-start gap-2.5">
      <span
        class="w-2 h-2 rounded-full shrink-0 mt-[0.45em]"
        style={{
          backgroundColor: topicColors[event.topic] ?? 'var(--color-text-muted)',
        }}
        title={event.topic}
      />
      <div class="flex-1 min-w-0">
        <div>
          <span class="group-hover:underline">{event.data.title}</span>
        </div>
        <div
          class="text-sm mt-0.5 flex items-center gap-1.5 flex-wrap"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>
            by{' '}
            <a
              class="no-underline hover:underline"
              style={{ color: 'inherit' }}
              href={'/organizer/' + event.organizer.id}
              onClick={(e) => e.stopPropagation()}
            >
              {event.organizer.data.name}
            </a>
          </span>
          <span>&middot;</span>
          <span>{shortDate(event.startDate)}</span>
          <span>&middot;</span>
          <span>{event.data.venue.title}</span>
        </div>
      </div>
    </div>
  )
}
