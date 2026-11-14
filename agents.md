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
│   ├── about.md         # About page text (its numbers and community list come from components/about/)
│   ├── add-event.md     # Add Event page text — the contributor guide
│   └── da/              # the Danish About and Add Event texts
├── assets/fonts/        # the two fonts as TrueType (with their licences), for drawing share cards
├── components/
│   ├── Board.astro            # the event lists: today, tomorrow, this/next week, a section per month; the archive
│   ├── Row.astro              # one row on the board
│   ├── Status.astro           # a row's status: NOW, TONIGHT, IN 6 DAYS
│   ├── Featured.astro         # highlighted events beside the board, one at a time: controls, timer, swipe
│   ├── FeaturedPoster.astro   # an event as a poster in its topic's color (also the event page's head)
│   ├── EventPage.astro        # an event page: its poster laid out wide (sign-up and calendar links in it), description
│   ├── event/                 # the event page's small parts: calendar links, the edit line
│   ├── OrganizerEvents.astro  # an organizer's events, coming up and past
│   ├── about/                 # the About page's numbers and its list of every community with its next event
│   └── TextPage.astro         # about, add event, organizer text
├── layouts/
│   ├── Layout.astro           # every page: head, header (logo, page title, language switch, subscribe + add-event icons, topics), footer (about line, two link groups, theme switch)
│   ├── RuntimeHead.astro      # before paint: the Danish home for who chose Danish, theme, the root's .js class, the clock (?now=), the section CSS
│   └── RuntimeBody.astro      # after parsing: tags events for the visitor's clock, counts, the phone topic switch, remembers the language, theme switch
├── lib/
│   ├── event.ts               # getEvents, getTopics, date formatting (Europe/Copenhagen)
│   ├── topics.ts              # per topic folder: display name, color (white text on it), what to call its events
│   ├── when.ts                # past / now / today / tomorrow / week …, and "in 5 days"
│   ├── format.ts              # date parts (English and Danish), row and poster helpers
│   ├── i18n.ts                # the two languages: which a page is in, its links, every interface string in both
│   ├── paths.ts               # the pages each dynamic route builds, shared with the Danish ones
│   ├── cards.ts               # which share card each page gets, and its file
│   ├── cardImage.ts           # draws a share card as a PNG (satori + sharp)
│   ├── calendar.ts            # /calendar.ics and add-to-calendar links
│   └── rss.ts                 # /rss.xml
├── pages/                     # routes (below); da/ wraps each page for its Danish address; og/ writes the share cards
└── styles/
    ├── global.css             # Tailwind, color tokens: a printed timetable in light, a night departure board (navy, amber) in dark
    ├── site.css               # the page frame, text pages, prose
    └── board.css              # the event lists
```

## Content Collections

Schema: `src/content.config.ts` (Zod, from `astro/zod`).

- **Events**: `src/content/event/<topic>/<name>.md`. `startTime`, `endTime` and `venue` are optional — leave them out until announced; the site shows "TBA". Times are Aarhus local time, 24-hour. `highlight: true` features the event beside the board until it has ended. `linkFor` (`signup`, `tickets`, `info`) names the event page's link to `learnMoreURL` ("Sign up", "Get tickets", "Read more"; "Event page" without it).
- **Organizers**: `src/content/organizer/<id>.md`; events reference them by id.
- **Pages**: `src/content/about.md`, `src/content/add-event.md`, and their Danish versions in `src/content/da/` (ids `da/about`, `da/add-event`). Change both languages together.

Files starting with `_` are ignored by the loaders.

## How the event lists work

What's past, today or next week depends on when someone looks, so the browser decides on every visit:

- The build renders each event into every section it could fall in (today, tomorrow, this week, next week, its month), each item carrying `data-start` / `data-end` (`eventAttrs` in `src/lib/format.ts`).
- `RuntimeBody.astro` tags every item with `data-when`: space-separated tags from `past upcoming now today soon tomorrow week nextweek later` (`src/lib/when.ts`). It also fills `<span data-rel>` ("in 5 days") and `<span data-count="past">`.
- The CSS in `RuntimeHead.astro` shows an item only in the section whose `data-bucket` matches its tags, and hides sections left empty. `data-empty="upcoming"` shows only while nothing in its `data-scope` (the board, not the featured posters beside it) is upcoming; `data-count` counts within its `data-scope` too. Tomorrow has its own section, so `board.css` keeps it out of this week and next week.
- Without JavaScript the page shows the state at build time.

**Featured events.** Every event with `highlight: true` that hasn't ended, from every topic, is drawn as a poster (`Featured.astro`), soonest first, on every list page (home, topics, past), beside the board on its right on wide screens and above it on narrow ones, where they start right at the header's rule. On phones only the home page shows them. In a stack the posters share the tallest one's height: the title's row takes the spare height and the carousel script evens out the organizer block and the link, so date, organizer and link sit at the same height on each. A featured poster shows the date, the organizer and a "Learn more" link to the event's page; the place and the link out to sign up are on that page's own poster. They take turns every 7 seconds; hovering, keyboard focus or the pause button holds them, and with reduced motion they only change when asked. Moving between pages, the carousel carries on where it was (poster, timer, pause), kept in `sessionStorage` for the tab's visit.

**Topic counts.** Each topic link in the header shows how many of its events are still to come, "(3)", and a topic with none is dimmed. The links carry their events' end times (`data-ends`) and `RuntimeBody` counts them on every visit. On phones the topics fold into one line: the current topic, and a "Topics" switch that opens the rest. The fold needs scripts (RuntimeHead marks the root `.js`), so without them every topic shows.

**Checking a moment.** `?now=2026-11-19T17:30` (Aarhus time) makes the site pretend it's then, for the rest of the tab's visit; `?now=` goes back to the real time.

**Share cards.** Every page has a 1200×630 card for links shared in Slack, LinkedIn, iMessage and so on, in its language: an event as its poster (topic color, title, date, place, organizer), a topic's list or archive in the topic's color, an organizer or the site's own pages on the dark board's navy. `src/lib/cards.ts` lists them (`cardPath` names a page's file; Layout.astro points `og:image` at it), `src/lib/cardImage.ts` lays one out with satori in the site's fonts (`src/assets/fonts/`, TrueType because satori can't read woff2) and sharp turns it into a PNG. A new kind of page needs a card in `cardPaths`, or its `og:image` points at nothing.

**Layout.** Two left edges. Every piece of text starts on the text edge; every rule, row line and box (the header's rule, section rules, a hovered row, the posters, the event page's poster) starts `--hang` further out and pads its text back in, so text and lines each share one edge. On phones the outer edge is the screen's. The current topic is underlined rather than boxed. The board lays out its rows by its own width (a container query), so they fold the same beside a poster as on a narrow screen.

## Routing

- `/` — upcoming events
- `/<topic>/` — upcoming events for one topic
- `/<topic>/<event>` — event page
- `/past/`, `/past/<topic>` — past events
- `/organizer/<id>` — organizer page
- `/about` — what the site is, live numbers, how to follow and add events, every community with its next event
- `/add-event` — the contributor guide
- `/calendar.ics` — every event, as a calendar to subscribe to
- `/rss.xml` — every upcoming event, as an RSS feed (`src/lib/rss.ts`); linked in the footer
- `/og/<page>.png`, `/og/da/<page>.png` — each page's share card (`/og/index.png` for the home page)
- `/da/…` — every page above (not the feeds) in Danish: `/da/`, `/da/<topic>`, `/da/<topic>/<event>`, `/da/past/…`, `/da/organizer/<id>`, `/da/about`, `/da/add-event`

**Languages.** English at `/…`, Danish at `/da/…`. Each file in `src/pages/da/` is a few lines that render the English page; every component reads the language from the address (`langOf(Astro.url)` in `src/lib/i18n.ts`) and takes its words from `t(lang)`, so a new piece of interface text goes into both `en` and `da` there (`da` is typed against `en`, so a missing one fails `astro check`). Links inside the site go through `localPath(lang, path)` to stay in the language. Dates come in both from `src/lib/format.ts`, "in 5 days" / "om 5 dage" from `src/lib/when.ts`, Danish topic names from `da` in `src/lib/topics.ts`. Event and organizer descriptions are shown as written, in either language. The DA/EN switch in the header links to the same page in the other language and remembers the choice; only a visit to the bare `aarhus.dev/` follows it (to `/da/`), so a link to an English page still opens in English. The feeds stay English.

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
