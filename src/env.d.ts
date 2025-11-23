import type { CollectionEntry } from 'astro:content'

declare global {
  type ADEvent = CollectionEntry<'events'> & {
    language: string
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
}
