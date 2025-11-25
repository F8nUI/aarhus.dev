# AI Agent Context for aarhus.dev

This document provides context for AI assistants working on the aarhus.dev codebase.

## Project Overview

A community-driven website showcasing tech events and meetups in Aarhus, Denmark. The site aggregates information about various technology communities (JavaScript, Rust, Swift, Ruby, etc.) and their events.

## Tech Stack

- **Astro** (v5.13+) - Static site generator with content collections
- **Preact** (v10.27+) - Interactive UI components
- **Tailwind CSS** (v4.1+) - Utility-first styling
- **Bun** - JavaScript runtime and package manager (v1.3.1+)
- **TypeScript** - Type safety

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── content/         # Content collections (markdown files)
│   │   ├── event/       # Event files organized by language
│   │   │   ├── js/      # JavaScript community events
│   │   │   ├── rust/    # Rust community events
│   │   │   ├── swift/   # Swift community events
│   │   │   └── ruby/    # Ruby community events
│   │   └── organizer/   # Organizer/community information
│   ├── pages/           # Astro pages and routing
│   ├── components/      # UI components (.astro and .tsx)
│   └── layouts/         # Layout components
├── package.json
└── tsconfig.json
```

## Key Concepts

### Content Collections

The project uses Astro's Content Collections for managing structured content:
- **Events**: Markdown files in `src/content/event/[lang]/` with frontmatter
- **Organizers**: Markdown files in `src/content/organizer/` with frontmatter

Templates are available at:
- `src/content/event/_template.md`
- `src/content/organizer/_template.md`

### Routing

Dynamic routes handle language-specific pages:
- `/[lang]/` - Language-specific event listings
- `/[lang]/[event]` - Individual event pages
- `/organizer/[organizer]` - Organizer profile pages

## Development Commands

```sh
bun install          # Install dependencies
bun run dev          # Start dev server (localhost:4321)
bun run build        # Build for production
bun run preview      # Preview production build
bun run astro ...    # Run Astro CLI commands
```

## Code Conventions

- **File naming**:
  - Use PascalCase for component files: `MyComponent.astro`
  - Use kebab-case for content (markdown) files: `my-event.md`
- **Components**: Can be `.astro` or `.tsx` (Preact)
- **Formatting**: Prettier is configured (see `.prettierrc`)
- **Content files**: Must follow the structure defined in content collection schemas
- **Commit messages**: If an AI agent creates a commit, prefix it with the agent name. For example: `Claude: Add new event template` or `Claude: Fix navigation bug`

## Content Management

Contributors can add events/organizers via:
1. **GitHub web UI** - Create files directly, auto-generates PR
2. **Local development** - Copy templates, edit, and submit PR

All content should be reviewed via PR before merging.

## Important Notes

- This is a static site - content changes require rebuild
- Event files are organized by programming language/community
- The main branch is `main` (use this for PRs)
- Uses Bun as the package manager (not npm/yarn)

## Contributing Guidelines

- Keep content community-focused and relevant to Aarhus tech scene
- Follow existing content structure and templates
- Ensure all markdown frontmatter is complete and valid
- Test locally with `bun run dev` before submitting PRs
