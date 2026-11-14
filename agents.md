# AI Agent Context for aarhus.dev

Community-driven timetable of tech events in Aarhus, Denmark. Static site, deployed on Vercel from `main`.

## Tech Stack

- **Astro 7** — static site generator with content collections
- **Tailwind CSS 4** — styling
- **Bun** — package manager and script runner
- **Node.js 26** — set in `package.json` `engines.node`; Vercel and CI both build with it
- **TypeScript** — type safety

No UI framework: everything is `.astro` components plus a few small inline scripts.

## Project Structure

```
src/
├── content/
│   ├── event/<topic>/   # events; the folder name is the topic
│   ├── organizer/       # community profiles
│   ├── about.md         # About page text
│   └── add-event.md     # Add Event page text — the contributor guide
├── components/
│   ├── Board.astro            # the event lists: today, tomorrow, this/next week, a section per month; the archive
│   ├── Row.astro              # one row on the board
│   ├── Status.astro           # a row's status: NOW, TONIGHT, IN 6 DAYS
│   ├── Featured.astro         # highlighted events beside the board, one at a time: controls, timer, swipe
│   ├── FeaturedPoster.astro   # one highlighted event as a poster in its topic's color
│   ├── EventPage.astro        # an event page: title, ticket (when, where, sign up), description
│   ├── OrganizerEvents.astro  # an organizer's events, coming up and past
│   └── TextPage.astro         # about, add event, organizer text
├── layouts/
│   ├── Layout.astro           # every page: head, header (logo, page title, subscribe + add-event icons, topics), footer (links, theme switch)
│   ├── RuntimeHead.astro      # before paint: theme, the clock (?now=), the section CSS
│   └── RuntimeBody.astro      # after parsing: tags events for the visitor's clock, counts, theme switch
├── lib/
│   ├── event.ts               # getEvents, getTopics, date formatting (Europe/Copenhagen)
│   ├── topics.ts              # display name + color per topic folder
│   ├── when.ts                # past / now / today / tomorrow / week …, and "in 5 days"
│   ├── format.ts              # date parts, row and poster helpers
│   └── calendar.ts            # /calendar.ics and add-to-calendar links
├── pages/                     # routes (below)
└── styles/
    ├── global.css             # Tailwind, color tokens: a printed timetable in light, the lit board in dark
    ├── site.css               # the page frame, text pages, prose
    └── board.css              # the event lists
```

## Content Collections

Schema: `src/content.config.ts` (Zod, from `astro/zod`).

- **Events**: `src/content/event/<topic>/<name>.md`. `startTime`, `endTime` and `venue` are optional — leave them out until announced; the site shows "TBA". Times are Aarhus local time, 24-hour. `highlight: true` features the event beside the board until it has ended.
- **Organizers**: `src/content/organizer/<id>.md`; events reference them by id.
- **Pages**: `src/content/about.md`, `src/content/add-event.md`.

Files starting with `_` are ignored by the loaders.

## How the event lists work

What's past, today or next week depends on when someone looks, so the browser decides on every visit:

- The build renders each event into every section it could fall in (today, tomorrow, this week, next week, its month), each item carrying `data-start` / `data-end` (`eventAttrs` in `src/lib/format.ts`).
- `RuntimeBody.astro` tags every item with `data-when`: space-separated tags from `past upcoming now today soon tomorrow week nextweek later` (`src/lib/when.ts`). It also fills `<span data-rel>` ("in 5 days") and `<span data-count="past">`.
- The CSS in `RuntimeHead.astro` shows an item only in the section whose `data-bucket` matches its tags, and hides sections left empty. `data-empty="upcoming"` shows only while nothing in its `data-scope` (the board, not the featured posters beside it) is upcoming; `data-count` counts within its `data-scope` too. Tomorrow has its own section, so `board.css` keeps it out of this week and next week.
- Without JavaScript the page shows the state at build time.

**Featured events.** Every event with `highlight: true` that hasn't ended, from every topic, is drawn as a poster (`Featured.astro`), soonest first, on every list page (home, topics, past), beside the board on wide screens and above it on narrow ones. They take turns every 7 seconds; hovering, keyboard focus or the pause button holds them, and with reduced motion they only change when asked. Moving between pages, the carousel carries on where it was (poster, timer, pause), kept in `sessionStorage` for the tab's visit.

**Checking a moment.** `?now=2026-11-19T17:30` (Aarhus time) makes the site pretend it's then, for the rest of the tab's visit; `?now=` goes back to the real time.

**Layout.** All text lines up on the page's left edge; backgrounds that frame text (the today board, a hovered row, the current topic, the posters) hang `--hang` outside it. The board lays out its rows by its own width (a container query), so they fold the same beside a poster as on a narrow screen.

## Routing

- `/` — upcoming events
- `/<topic>/` — upcoming events for one topic
- `/<topic>/<event>` — event page
- `/past/`, `/past/<topic>` — past events
- `/organizer/<id>` — organizer page
- `/about`, `/add-event` — static pages
- `/calendar.ics` — every event, as a calendar to subscribe to

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
