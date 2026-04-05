# aarhus.dev

A community-driven timetable of tech events in Aarhus, Denmark.

## Setup

```sh
bun install
bun run dev       # localhost:4321
bun run build     # production build
bun run preview   # preview build
```

Requires [Bun](https://bun.sh) v1.3.1+.

## Project structure

```
src/
├── content/
│   ├── event/         # Events organized by topic
│   │   ├── js/
│   │   ├── rust/
│   │   ├── swift/
│   │   ├── ruby/
│   │   ├── dotnet/
│   │   └── ai/
│   └── organizer/     # Community profiles
├── pages/             # Astro pages
│   └── [topic]/       # Topic and event routes
├── components/        # UI components (.astro, .tsx)
└── layouts/           # Layout components
```

## Adding content

See [CONTRIBUTING.md](CONTRIBUTING.md) or the [Add Event](https://aarhus.dev/add-event) page on the site.

## Tech stack

[Astro](https://astro.build) · [Preact](https://preactjs.com) · [Tailwind CSS](https://tailwindcss.com) · [Bun](https://bun.sh)

## License

MIT
