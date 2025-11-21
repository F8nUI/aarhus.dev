import type { CollectionEntry } from 'astro:content'

declare global {
  type ADEvent = CollectionEntry<'events'> & {
    language: string
    eventId: string
  }
}
