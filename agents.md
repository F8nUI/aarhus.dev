# AI Agent Context for aarhus.dev

Community-driven timetable of tech events in Aarhus, Denmark.

## Tech Stack

- **Astro** (v5.13+) — static site generator with content collections
- **Preact** (v10.27+) — interactive UI components
- **Tailwind CSS** (v4.1+) — styling
- **Bun** — runtime and package manager (v1.3.1+)
- **TypeScript** — type safety

## Project Structure

```
src/
├── content/
│   ├── event/         # Events organized by topic (js/, rust/, swift/, ruby/, dotnet/, ai/)
│   └── organizer/     # Community profiles
├── pages/
│   ├── [topic]/       # Topic listing and event detail pages
│   ├── organizer/     # Organizer pages
│   ├── about.astro
│   └── add-event.astro
├── components/        # .astro and .tsx (Preact)
├── layouts/           # Layout components
├── lib/               # Utilities (event parsing, topic helpers)
└── styles/            # Global CSS with design tokens
```

## Content Collections

- **Events**: `src/content/event/[topic]/event-name.md` — topic directory determines category
- **Organizers**: `src/content/organizer/organizer-id.md`
- **Pages**: `src/content/about.md`, `src/content/add-event.md`

Templates: `src/content/event/_template.md`, `src/content/organizer/_template.md`

## Routing

- `/` — all events
- `/[topic]/` — filtered by topic (js, rust, swift, ai, dotnet, etc.)
- `/[topic]/[event]` — event detail page
- `/organizer/[organizer]` — organizer profile
- `/about`, `/add-event` — static pages

## Commands

```sh
bun install          # install dependencies
bun run dev          # dev server at localhost:4321
bun run build        # production build
bun run astro check  # type checking
```

## Conventions

- PascalCase for components, kebab-case for content files
- Plain descriptive commit messages, no prefixes
- Content changes via PR, reviewed before merging
- Bun only (not npm/yarn)
