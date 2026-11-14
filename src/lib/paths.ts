// The pages each dynamic route builds, shared by the English pages and their Danish
// wrappers in src/pages/da/: each exports one of these as its getStaticPaths.
import { getCollection } from 'astro:content'
import { getTopics, parseEvent } from '@lib/event'

/** A topic's list and its archive: /rust, /past/rust. */
export async function topicPaths() {
  return (await getTopics()).map((topic) => ({ params: { topic } }))
}

/** An event's page, /rust/talk-night-eiva-26-nov, with the event as a prop. */
export async function eventPaths() {
  const entries = await getCollection('events')
  return Promise.all(
    entries.map(async (entry) => {
      const event = await parseEvent(entry)
      return { params: { topic: event.topic, event: entry.id.split('/')[1] }, props: { event } }
    }),
  )
}

/** An organizer's page, /organizer/rust-aarhus, with the organizer as a prop. */
export async function organizerPaths() {
  return (await getCollection('organizers')).map((organizer) => ({
    params: { organizer: organizer.id },
    props: { organizer },
  }))
}
