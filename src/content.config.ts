import { defineCollection, reference } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const organizers = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: 'src/content/organizer' }),
  schema: z.object({
    name: z.string(),
    website: z.url().optional(),
  }),
})

// Aarhus local time, 24-hour: "18:00" (a leading zero may be left out: "9:30").
const time = z
  .string()
  .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Use 24-hour time like 18:00')
  .transform((t) => t.padStart(5, '0'))

const events = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: 'src/content/event' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.date(),
    endDate: z.date().optional(), // multi-day events only
    // Leave out what isn't announced yet: the site shows "time TBA" / "venue TBA".
    startTime: time.optional(),
    endTime: time.optional(),
    organizer: reference('organizers'),
    venue: z
      .object({
        title: z.string(),
        address: z.string(),
      })
      .optional(),
    learnMoreURL: z.url(),
    // Feature the event at the top of the list until it has ended.
    highlight: z.boolean().optional(),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
})

export const collections = { events, organizers, pages }
