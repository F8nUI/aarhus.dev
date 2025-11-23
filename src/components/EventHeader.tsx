import getLanguageColor from '@lib/languageColor'
import type { ComponentChild } from 'preact'

interface SectionProps {
  event: ADEvent
  isEventPage: boolean
  languageBadge: boolean
}

export default function EventHeader({ event, isEventPage, languageBadge }: SectionProps) {
  function Organizer({ isVisible }: { isVisible: boolean }) {
    return isVisible && <p class="opacity-30 text-nowrap">by {event.organizer.data.name}</p>
  }

  function Badge({
    color,
    children,
    className,
  }: {
    color?: string
    children: ComponentChild
    className?: string
  }) {
    return (
      <span
        class={['w-fit px-1.5 py-0.5 text-sm no-underline', className, color ?? 'bg-amber-100']
          .filter((c) => c)
          .join(' ')}
      >
        {children}
      </span>
    )
  }

  return (
    <div class="leading-tight group">
      <div>
        <div
          class={['flex space-x-2 items-center flex-wrap', isEventPage && 'font-semibold text-3xl']
            .filter((v) => v)
            .join(' ')}
        >
          {languageBadge && (
            <Badge color={getLanguageColor(event.language)}>{event.language}</Badge>
          )}
          <span
            class={['text-nowrap', !isEventPage && 'group-hover:underline']
              .filter((c) => c)
              .join(' ')}
          >
            {event.data.title}
          </span>
          <div class="space-x-2 items-center layout:flex hidden">
            <Organizer isVisible={!isEventPage} />
          </div>
        </div>
        <div class="max-layout:flex hidden">
          <Organizer isVisible={!isEventPage} />
        </div>
        {isEventPage ? (
          <div class="flex flex-col text-sm opacity-50 mt-2">
            <span>
              Organized by{' '}
              <a href={'/organizer/' + event.organizer.id}>{event.organizer.data.name}</a>
            </span>
            <p class="">
              When: {event.dateFormatted.date}, {event.dateFormatted.time}
            </p>
            <p class="">Where: {event.data.venue.address}</p>
            {event.data.learnMoreURL && <a href={event.data.learnMoreURL}>Attend / Learn more…</a>}
          </div>
        ) : (
          <div class="flex items-center space-x-2 text-lg opacity-50 flex-wrap">
            <p class="text-nowrap">{event.startDateFormatted}</p>
            <p class="text-nowrap">@ {event.data.venue.title}</p>
          </div>
        )}
      </div>
    </div>
  )
}
