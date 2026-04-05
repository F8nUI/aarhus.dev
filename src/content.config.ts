import { defineCollection, reference, z } from 'astro:content'
import { glob } from 'astro/loaders'

const organizers = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: 'src/content/organizer' }),
  schema: z.object({
    name: z.string(),
    website: z.string().optional(),
  }),
})

const events = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: 'src/content/event' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.date(),
    startTime: z.string(),
    endDate: z.date().optional(),
    endTime: z.string(),
    organizer: reference('organizers'),
    venue: z.object({
      title: z.string(),
      address: z.string(),
    }),
    learnMoreURL: z.string(),
    // TODO: speakers
    // TODO: program
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
