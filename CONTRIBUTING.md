# Contributing

## Adding an event or organizer

The guide, with the template and every field, is on the site: **[aarhus.dev/add-event](https://aarhus.dev/add-event)** (source: [`src/content/add-event.md`](src/content/add-event.md)).

In short: one Markdown file per event in `src/content/event/<topic>/`, added by pull request — or fill in the [Add Event form](https://github.com/f8nui/aarhus.dev/issues/new?template=add_event.yml) and a maintainer adds it for you.

## Working on the site

Requires [Bun](https://bun.sh) and Node.js 26 (`engines` in `package.json`; Vercel and CI build with it).

```sh
bun install
bun run dev          # dev server at localhost:4321
bun run astro check  # type check
bun run build        # production build
```

Every pull request runs `astro check` and the build ([`.github/workflows/build.yml`](.github/workflows/build.yml)).

How it fits together:

- `src/content.config.ts` — the schema every event and organizer file is checked against.
- `src/lib/event.ts` — loads events and formats their dates (always Aarhus time).
- `src/lib/topics.ts` — per topic folder: display name, color, and optionally what to call its events ("dev conferences"), with Danish versions under `da` where they differ.
- `src/lib/i18n.ts` — the site in English (`/…`) and Danish (`/da/…`): every piece of interface text in both. Add new text to both languages; the About and Add event texts have Danish versions in `src/content/da/` to keep in step.
- `src/components/Board.astro` — the event lists: today, tomorrow, this week, next week, then a section per month, with highlighted events as posters beside them (`Featured.astro`). The build renders the rows; a small script sorts them into the right section by the visitor's clock (`src/layouts/RuntimeBody.astro`), so the lists stay right between deploys.
- `src/components/EventPage.astro` — an event's page: the event's poster laid out wide, with the sign-up and add-to-calendar links in it, then its description.

## Code style

- Components in PascalCase (`EventPage.astro`), content files in kebab-case (`talk-night-eiva-26-nov.md`).
- TypeScript, Tailwind CSS for styling.
- Plain descriptive commit messages, no prefixes.

## Pull requests

1. Fork the repository and create a branch.
2. Make your change; `bun run build` should pass.
3. Open a pull request against `main`.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
