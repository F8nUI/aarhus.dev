# aarhus.dev

A community-driven timetable of tech events in Aarhus, Denmark.

## Adding an event

See [aarhus.dev/add-event](https://aarhus.dev/add-event): one Markdown file per event by pull request, or fill in the [Add Event form](https://github.com/f8nui/aarhus.dev/issues/new?template=add_event.yml).

## Setup

Requires [Bun](https://bun.sh) and Node.js 26 (`engines` in `package.json`; Vercel and CI build with it).

```sh
bun install
bun run dev          # localhost:4321
bun run astro check  # type check
bun run build        # production build
bun run preview      # preview the build
```

## Project structure

```
src/
├── content/
│   ├── event/<topic>/   # one Markdown file per event; the folder is its topic
│   ├── organizer/       # one file per community or company
│   ├── about.md         # text of the About page
│   └── add-event.md     # text of the Add Event page
├── components/          # Astro components (event list, rows, header)
├── layouts/             # page layouts
├── lib/                 # loading events, date formatting, topic names and colors
├── pages/               # routes
└── styles/              # global CSS and color tokens
```

More in [CONTRIBUTING.md](CONTRIBUTING.md).

## Tech stack

[Astro](https://astro.build) · [Tailwind CSS](https://tailwindcss.com) · [Bun](https://bun.sh) · deployed on [Vercel](https://vercel.com) from `main`

## License

MIT
