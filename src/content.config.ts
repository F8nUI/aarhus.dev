import {
  defineCollection,
  reference,
  render,
  z,
  type CollectionEntry,
  type InferEntrySchema,
  type RenderResult,
} from 'astro:content'
import { glob } from 'astro/loaders'
import { getCollection } from 'astro:content'

const organizers = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/organizer' }),
  schema: z.object({
    name: z.string(),
    website: z.string().optional(),
    // logo: asset
    // backgroundImage: asset
  }),
})

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/event' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.date(),
    organizer: reference('organizers'),
    venue: z.object({
      title: z.string(),
      address: z.string(),
    }),
    learnMoreURL: z.string().optional(),
    signUpURL: z.string().optional(),
  }),
})

export const collections = { events, organizers }
