# Contributing to aarhus.dev

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Ways to Contribute

- **Add Events** - Share upcoming tech events in Aarhus
- **Add Organizers** - Add tech communities and meetup organizers
- **Report Bugs** - Found something broken? Open an issue
- **Suggest Features** - Have ideas? Open an issue to discuss
- **Code Contributions** - Fix bugs or implement features

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.1 or higher
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork:
   ```sh
   git clone https://github.com/YOUR-USERNAME/aarhus.dev.git
   cd aarhus.dev
   ```
3. Install dependencies:
   ```sh
   bun install
   ```
4. Start the dev server:
   ```sh
   bun run dev
   ```
   Visit `http://localhost:4321`

5. Create a branch:
   ```sh
   git checkout -b my-feature
   ```

## Development Commands

```sh
bun run dev         # Start dev server
bun run build       # Build for production
bun run astro check # Type checking (for code changes)
```

## Adding Content

### Adding an Event

**Option 1: Via GitHub (Easiest)**

1. Navigate to the language directory (e.g., [`src/content/event/js/`](src/content/event/js/))
2. Click "Add file" → "Create new file"
3. Copy the template from [`src/content/event/_template.md`](src/content/event/_template.md)
4. Commit to create a pull request

**Option 2: Locally**

1. Copy the template:
   ```sh
   cp src/content/event/_template.md src/content/event/js/my-event.md
   ```

2. Fill in the frontmatter (check the template for all available fields):
   ```yaml
   ---
   organizer: 'aarhus-js'
   title: "Aarhus.js Monthly Meetup"
   # subtitle: "Optional Subtitle"
   date: 2025-02-15
   startTime: 18:00
   # endDate: 2025-02-15  # Optional, for multi-day events
   endTime: 20:00
   venue:
     title: 'TechHub Aarhus'
     address: 'Some Street 1, Aarhus'
   learnMoreURL: https://example.com/event
   ---

   ## Event Description

   Add your event details here using Markdown...
   ```

3. Test with `bun run dev` and create a pull request

### Adding an Organizer

Use the template at [`src/content/organizer/_template.md`](src/content/organizer/_template.md):

```yaml
---
name: 'Organizer Name'
website: https://example.com
---

## About

Information about the organizer...
```

## Code Style Guidelines

### General

- Follow existing patterns in the codebase
- Use PascalCase for component files: `MyComponent.astro`
- Use kebab-case for content (markdown) files: `my-event.md`
- Write TypeScript with proper types (avoid `any`)

### Styling

- Use Tailwind CSS utility classes for component styling
- For markdown content styling, add styles to `src/styles/global.css`
- Keep custom CSS minimal and scoped when possible

## Submitting Changes

### Before Submitting

- Ensure `bun run build` completes without errors
- Run `bun run astro check` if you modified code
- Test your changes locally

### Pull Request Process

1. Push your branch to your fork
2. Open a Pull Request against `main`
3. Fill in the PR template
4. Address any review feedback

## Questions?

- Check existing issues
- Open a new issue with your question

Thank you for contributing to the Aarhus tech community!
