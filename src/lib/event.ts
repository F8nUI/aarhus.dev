import { getCollection, type CollectionEntry } from 'astro:content'

type Event = CollectionEntry<'events'> & {
  language: string
  eventId: string
}

export async function getEvents(): Promise<Event[]> {
  const events = await getCollection('events')

  return events
    .map((event) => {
      const [language, eventId] = event.id.split('/')
      return {
        ...event,
        language,
        eventId,
      }
    })
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getLanguages(): Promise<string[]> {
  const events = await getEvents()
  let languages = events.flatMap((e) => e.id.split('/')[0]).filter((lang) => lang)
  return [...new Set(languages)]
}
