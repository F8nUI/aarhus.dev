# AI Agent Context for aarhus.dev

Community-driven timetable of tech events in Aarhus, Denmark. Static site, deployed on Vercel from `main`.

## Tech Stack

- **Astro 7** — static site generator with content collections
- **Tailwind CSS 4** — styling
- **Bun** — package manager and script runner
- **Node.js 26** — set in `package.json` `engines.node`; Vercel and CI both build with it
- **TypeScript** — type safety

No UI framework: everything is `.astro` components plus one small inline script.

## Project Structure

```
src/
├── content/
│   ├── event/<topic>/   # events; the folder name is the topic
│   ├── organizer/       # community profiles
│   ├── about.md         # About page text
│   └── add-event.md     # Add Event page text — the contributor guide
├── components/
│   ├── EventList.astro  # list pages; inline script sorts rows by the visitor's clock
│   ├── EventRow.astro   # one row
│   ├── Header.astro     # site title, topic links, theme toggle
│   └── TopicDot.astro
├── layouts/             # Layout.astro (every page), ContentPage.astro (about, add-event)
├── lib/
│   ├── event.ts         # getEvents, getTopics, date formatting (Europe/Copenhagen)
│   └── topics.ts        # display name + color per topic folder
├── pages/               # routes (below)
└── styles/global.css    # color tokens, light/dark, prose
```

## Content Collections

Schema: `src/content.config.ts` (Zod, from `astro/zod`).

- **Events**: `src/content/event/<topic>/<name>.md`. `startTime`, `endTime` and `venue` are optional — leave them out until announced; the site shows "TBA". Times are Aarhus local time, 24-hour.
- **Organizers**: `src/content/organizer/<id>.md`; events reference them by id.
- **Pages**: `src/content/about.md`, `src/content/add-event.md`.

Files starting with `_` are ignored by the loaders.

## How the event lists work

The build renders every row with `data-start` / `data-end` timestamps. An inline script in `EventList.astro` runs on every visit and moves rows into happening now / today / upcoming, or out to past, by the visitor's clock — so lists stay correct between deploys. Without JavaScript the page shows the state at build time.

## Routing

- `/` — upcoming events
- `/<topic>/` — upcoming events for one topic
- `/<topic>/<event>` — event page
- `/past/`, `/past/<topic>` — past events
- `/organizer/<id>` — organizer page
- `/about`, `/add-event` — static pages

## Commands

```sh
bun install          # install dependencies
bun run dev          # dev server at localhost:4321
bun run build        # production build
bun run astro check  # type checking
```

CI (`.github/workflows/build.yml`) runs `astro check` and the build on every pull request.

## Conventions

- PascalCase for components, kebab-case for content files (`talk-night-eiva-26-nov.md`)
- Plain descriptive commit messages, no prefixes, no version numbers (the site isn't versioned)
- Content changes via PR, reviewed before merging
- Bun only (not npm/yarn)
