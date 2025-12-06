# aarhus.dev

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro)](https://astro.build)
[![Powered by Bun](https://img.shields.io/badge/Powered%20by-Bun-000000?logo=bun)](https://bun.sh)

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

## Troubleshooting

### Common Issues

#### Port Already in Use

If you see an error that port 4321 is already in use:

```sh
# Find the process using the port
lsof -ti:4321

# Kill the process
kill -9 $(lsof -ti:4321)

# Or start on a different port
bun run dev -- --port 3000
```

#### Build Fails with Type Errors

```sh
# Run type checking to see detailed errors
bun run astro check

# Clear cache and rebuild
rm -rf dist .astro
bun run build
```

#### Bun Installation Issues

If you encounter issues installing Bun, refer to the [official Bun installation guide](https://bun.sh/docs/installation).

#### Content Not Showing Up

- Ensure the markdown file has valid frontmatter
- Check that the file is in the correct directory (`src/content/event/[lang]/` or `src/content/organizer/`)
- Verify the frontmatter matches the schema requirements
- Restart the dev server after adding new content files

#### Node.js Compatibility

This project is designed to work with Bun. While it may work with Node.js, Bun is the recommended runtime for the best experience.

### Getting Help

If you encounter other issues:

1. Check existing [GitHub issues](https://github.com/f8nui/aarhus.dev/issues)
2. Search the [Astro documentation](https://docs.astro.build)
3. Open a new issue with details about your problem

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork: `git clone https://github.com/f8nui/aarhus.dev.git`
3. Create a branch: `git checkout -b my-feature`
4. Make your changes
5. Test locally: `bun run dev` and `bun run build`
6. Commit and push: `git commit -am "Add feature" && git push origin my-feature`
7. Open a Pull Request

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

MIT License - see [LICENSE](LICENSE) file for details
