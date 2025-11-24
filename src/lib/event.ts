import { getCollection, getEntry, type CollectionEntry } from 'astro:content'

export async function getEvents(): Promise<ADEvent[]> {
  const events = await getCollection('events')

  const adEvents: ADEvent[] = []

  for (const event of events) {
    adEvents.push(await parseEvent(event))
  }

  return adEvents.sort((a, b) => b.startDate.valueOf() - a.startDate.valueOf())
}

export async function parseEvent(event: CollectionEntry<'events'>): Promise<ADEvent> {
  const [language, eventId] = event.id.split('/')
  const startDate = toCphDate(event.data.date, event.data.startTime)
  const endDate = toCphDate(event.data.endDate ?? event.data.date, event.data.endTime)
  return {
    ...event,
    language,
    eventId,
    startDate,
    endDate,
    startDateFormatted: formatEventDate(startDate),
    endDateFormatted: formatEventDate(endDate),
    dateFormatted: formatEventDateRange(startDate, endDate),
    organizer: await getEntry(event.data.organizer),
  }
}

export async function getLanguages(): Promise<string[]> {
  const events = await getEvents()
  let languages = events
    .flatMap((e) => e.id.split('/')[0])
    .filter((lang) => lang)
    .sort()
    .reverse()
  return [...new Set(languages)]
}

export function getLanguageName(languageCode: string): string {
  const languageMap: Record<string, string> = {
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
  }

  return languageMap[languageCode.toLowerCase()] || languageCode
}

function toCphDate(date: Date, time: string): Date {
  const dateStr = date.toISOString().split('T')[0]
  const iso = `${dateStr}T${time}`
  const tempDate = new Date(iso + 'Z')
  const cphTime = new Date(tempDate.toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }))
  const utcTime = new Date(tempDate.toLocaleString('en-US', { timeZone: 'UTC' }))
  const offsetMs = utcTime.getTime() - cphTime.getTime()
  const offset = offsetMs === -3600000 ? '+01:00' : '+02:00'

  return new Date(iso + offset)
}

function formatEventDate(date: Date): string {
  const weekday = date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'Europe/Copenhagen',
  })
  const day = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Copenhagen',
  })
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Copenhagen',
  })

  return `${weekday}, ${day} at ${time}`
}

function formatEventDateRange(startDate: Date, endDate: Date): { date: string; time: string } {
  const options = { timeZone: 'Europe/Copenhagen' }

  const weekday = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    ...options,
  })
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
