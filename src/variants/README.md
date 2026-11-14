# Design variants (prototype branch)

Every page renders **all** variants; only the active one is visible. The debug
overlay (bottom right) switches between them:

- keys **0–5**, **[** / **]** to step, **`** to collapse the panel
- `?v=3` in the URL picks variant 3 (remembered in localStorage)
- the **now** field (or `?now=2026-11-19T17:30`, Aarhus time) pretends it is that moment,
  so you can see each design's *happening now* / *today* states; **real** resets it

`v0` is the current design, for comparison. `/calendar.ics` is a subscribable feed of every event.

| | Name | |
|---|---|---|
| v1 | Departure Board | A time-led timetable; today on an amber board |
| v2 | Board + Flyer | v1, with the head event as Poster's gig flyer on top |
| v3 | Board + Ticket | v1, with the head event as a big amber ticket on top |
| v4 | Board + Side Poster | v1, with the head event as a portrait poster beside the board |
| v5 | Poster | The next event as a gig flyer, everything else as a one-line index |

## A variant

A folder `vN/` with `meta.ts` (name, one-line summary, optional Google Fonts URL — shown in the
overlay) and three Astro components, all wired up in `registry.ts`:

| Component | Props | Renders |
|---|---|---|
| `Shell.astro` | `topic?: string`, `topics: string[]`, slot | Header, `<main>` with the slot, footer — the whole page frame |
| `List.astro` | `events: ADEvent[]` (every event for the page, oldest first, **past ones included**), `topic?: string`, `past: boolean` | Home (`/`), topic (`/rust`) and archive (`/past`, `/past/rust`) lists |
| `Event.astro` | `event: ADEvent`, slot (the rendered Markdown description) | An event page |

Text pages (About, Add Event, organizer pages) are rendered by `VariantPage.astro`
inside your Shell with fixed markup — style it under your block:
`.v-page`, `.v-page-header`, `.v-page-header h1`, `.v-page-description`, `.v-page-website`, `.prose`.

### The data

`ADEvent` (from `@lib/event`): `event.data.{title, subtitle?, date, endDate?, startTime?, endTime?, venue?: {title, address}, learnMoreURL, highlight?}`,
`event.topic` (folder, e.g. `rust`), `event.url` (`/rust/talk-night-eiva-26-nov`), `event.start` / `event.end` (Dates),
`event.organizer.{id, data.name, data.website?}`. Missing `startTime` / `venue` mean "not announced" — show TBA.
`highlight: true` marks an event to feature (see *The board family* below).

Helpers in `shared.ts`: formatting (`formatShort`, `formatLong`, `formatMonth`, `dayNumber`, `weekdayShort`,
`monthShort`, `timeRange`, `weekOf`, `groupBy`), `topicName` / `topicColor`, `mapUrl`, `googleCalendarUrl`,
`icsHref` + `icsFileName` (one-event download), `calendarFeed` (subscribe links), `linkHost` ("meetup.com" — name the
sign-up destination on the button), `editUrl` ("Edit on GitHub" link for an event).

### Time: what is past, now, today

Which events are past or happening now depends on when someone looks, so the browser decides on every visit.

- Put `{...eventAttrs(event)}` on the root element of every event item. The runtime sets `data-when` on it:
  space-separated tags from `past upcoming now today soon tomorrow week nextweek later` (see `when.ts`).
- **Buckets**: a container with `data-bucket="today"` shows only items tagged `today`, hides any
  `[data-group]` inside it (e.g. a month group) left without such an item, and hides itself when empty.
  Render the same events into several buckets (now / today / week / later …) and each item appears in the right one.
- `data-empty="upcoming"` — shown only while the variant has no item tagged `upcoming` (empty state).
- `<span data-count="past"></span>` — filled with how many distinct events are tagged `past`.
- `<span data-rel></span>` inside an item — filled with "happening now", "tomorrow", "in 5 days"…
  (`relativeAtBuild(event)` gives the build-time text to start with).
- Style states with `[data-when~="now"]` etc. — e.g. a pulsing dot, dimmed past days in a calendar grid.

The home page gets all events including past ones: show the upcoming ones and a link to `/past`
(or `/past/<topic>`) with the past count. The archive (`past: true`) shows the past ones, newest first.

## The board family (v1–v4)

v2–v4 are variations on v1, Departure Board. The registry gives them v1's `Shell` and `Event`, and each one's
`List` is v1's `List` with a `Head` component: the head event, drawn three ways.

| Variant | Head | Where |
|---|---|---|
| v2 Board + Flyer | `v2/Flyer.astro` | above the board |
| v3 Board + Ticket | `v3/Ticket.astro` | above the board |
| v4 Board + Side Poster | `v4/SidePoster.astro` | beside the board on wide screens (`headBeside`), above it on narrow ones |

- **The head event** is the first event with `highlight: true` that hasn't ended. v1's `List` draws a `Head` for every
  highlighted event still to come at build time, each carrying `eventAttrs`, and CSS shows the first one not tagged
  `past`, so it moves on by itself when one ends. Nothing highlighted coming up (on this topic): no head event.
- **One text edge.** All text lines up on the page's left edge. Backgrounds that frame text (the today board, a
  hovered row, the current topic, a head event) hang `--hang` (0.75rem) outside it; on phones the boards run edge to edge.
- **The board lays out by its own width** (a container query), so its rows fold the same way beside a poster as on a
  narrow screen.
- **Styles:** v1's are scoped to all four blocks (`:is([data-variant-block='v1'], … 'v4')`) and its tokens to all
  four `data-variant`s; each head's own styles are scoped to its variant.

## Rules

- **Scope everything to your variant** (the board family shares v1's, see above). Use Astro's scoped `<style>`, or `<style is:global>` with every selector
  under `[data-variant-block="vN"]`. Never style bare elements globally.
- **Colors as tokens.** Set `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border`,
  `--color-bg-subtle` (and your own `--vN-*`) on `:root[data-variant="vN"]`, with dark values under
  `:root[data-variant="vN"][data-theme="dark"]` and
  `@media (prefers-color-scheme: dark) { :root[data-variant="vN"]:not([data-theme="light"]) { … } }`.
  `body` paints `--color-bg` / `--color-text`, so the whole page follows your tokens.
- **No `id` attributes** — six variants share each page. A theme switch is any element with class `theme-toggle`.
- **Light and dark**, **390 px wide without horizontal scrolling**, visible keyboard focus, respect `prefers-reduced-motion`.
- Tailwind 4 classes are available. No new npm dependencies, no client framework. A small inline script is fine if it
  only touches elements inside `[data-variant-block="vN"]`.
- Fonts: a Google Fonts `css2` URL in the registry entry (prototype only — production would self-host).
