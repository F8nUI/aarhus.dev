import { getCollection, getEntry, type CollectionEntry } from 'astro:content'

export type ADEvent = CollectionEntry<'events'> & {
  topic: string
  eventId: string
  startDate: Date
  startDateFormatted: string
  endDate: Date
  endDateFormatted: string
  dateFormatted: {
    date: string
    time: string
  }
  organizer: CollectionEntry<'organizers'>
}

export async function getEvents(): Promise<ADEvent[]> {
  const events = await getCollection('events')

  const adEvents: ADEvent[] = []

  for (const event of events) {
    adEvents.push(await parseEvent(event))
  }

  return adEvents.sort((a, b) => b.startDate.valueOf() - a.startDate.valueOf())
}

export async function parseEvent(event: CollectionEntry<'events'>): Promise<ADEvent> {
  const [topic, eventId] = event.id.split('/')
  const startDate = toCphDate(event.data.date, event.data.startTime)
  const endDate = toCphDate(event.data.endDate ?? event.data.date, event.data.endTime)
  return {
    ...event,
    topic,
    eventId,
    startDate,
    endDate,
    startDateFormatted: formatEventDate(startDate),
    endDateFormatted: formatEventDate(endDate),
    dateFormatted: formatEventDateRange(startDate, endDate),
    organizer: await getEntry(event.data.organizer),
  }
}

export async function getTopics(): Promise<string[]> {
  const events = await getCollection('events')
  const topics = [...new Set(events.map((e) => e.id.split('/')[0]))]
  return topics.sort().reverse()
}

export function getTopicName(topicCode: string): string {
  const topicMap: Record<string, string> = {
    js: 'JavaScript',
    rust: 'Rust',
    swift: 'Swift',
    ruby: 'Ruby',
    python: 'Python',
    go: 'Go',
    java: 'Java',
    kotlin: 'Kotlin',
    cpp: 'C++',
    csharp: 'C#',
    php: 'PHP',
    typescript: 'TypeScript',
    dotnet: '.NET',
    ai: 'AI',
  }

  return topicMap[topicCode.toLowerCase()] || topicCode
}

const CPH_TIMEZONE = 'Europe/Copenhagen'

const cphOffsetFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: CPH_TIMEZONE,
  timeZoneName: 'longOffset',
})

function toCphDate(date: Date, time: string): Date {
  const dateStr = date.toISOString().split('T')[0]
  // Determine the Copenhagen UTC offset for this specific date
  const noonUtc = new Date(`${dateStr}T12:00:00Z`)
  const parts = cphOffsetFormatter.formatToParts(noonUtc)
  const tzPart = parts.find((p) => p.type === 'timeZoneName')
  const offset = tzPart?.value.replace('GMT', '') || '+01:00'
  return new Date(`${dateStr}T${time}:00${offset}`)
}

function formatEventDate(date: Date): string {
  const options = { timeZone: CPH_TIMEZONE } as const
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long', ...options })
  const day = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', ...options })
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  })

  return `${weekday}, ${day} at ${time}`
}

function formatEventDateRange(startDate: Date, endDate: Date): { date: string; time: string } {
  const options = { timeZone: CPH_TIMEZONE } as const

  const weekday = startDate.toLocaleDateString('en-US', { weekday: 'long', ...options })
  const day = startDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    ...options,
  })
  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  })
  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  })

  return {
    date: `${weekday}, ${day}`,
    time: `${startTime} – ${endTime}`,
  }
}
