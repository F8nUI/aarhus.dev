# aarhus.dev

A community-driven website showcasing tech events and meetups in Aarhus, Denmark.

## About

This project aggregates information about various technology communities and their events in Aarhus, including JavaScript, Rust, Swift, Ruby, and more.

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Preact](https://preactjs.com) - Interactive UI components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Bun](https://bun.sh) - JavaScript runtime and package manager

## Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── content/         # Content collections
│   │   ├── event/       # Event markdown files (organized by language)
│   │   │   ├── js/
│   │   │   ├── rust/
│   │   │   ├── swift/
│   │   │   └── ruby/
│   │   └── organizer/   # Organizer information
│   ├── pages/           # Astro pages
│   └── components/      # UI components
└── package.json
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3.1 or higher)

### Installation

```sh
bun install
```

### Development

Start the local dev server:

```sh
bun run dev
```

The site will be available at `http://localhost:4321`

### Build

Build for production:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Adding Content

You can add events and organizers directly through the GitHub web interface - no need to clone the repository or create a PR manually!

### Adding a New Event

1. Navigate to the appropriate language directory on GitHub (e.g., `src/content/event/js/`)
2. Click "Add file" → "Create new file"
3. Use the template from `src/content/event/_template.md` as a reference
4. Name your file (the filename will be used as the URL slug)
5. Fill in the event details in the frontmatter
6. Add event description and details in the content body
7. Commit the file - this will automatically create a PR for review

Alternatively, you can work locally:
1. Copy the template file `src/content/event/_template.md`
2. Place it in the appropriate language directory (e.g., `js/`, `rust/`, `swift/`, `ruby/`)
3. Rename the file and fill in the details
4. Create a PR with your changes

### Adding a New Organizer

1. Navigate to `src/content/organizer/` on GitHub
2. Click "Add file" → "Create new file"
3. Use the template from `src/content/organizer/_template.md` as a reference
4. Name the file to match your organizer's ID
5. Fill in the organizer details
6. Commit the file - this will automatically create a PR for review

Or work locally by copying `src/content/organizer/_template.md` and creating a PR.

## Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `bun install`          | Installs dependencies                            |
| `bun run dev`          | Starts local dev server at `localhost:4321`      |
| `bun run build`        | Build your production site to `./dist/`          |
| `bun run preview`      | Preview your build locally, before deploying     |
| `bun run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `bun run astro --help` | Get help using the Astro CLI                     |

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

MIT License - see [LICENSE](LICENSE) file for details
