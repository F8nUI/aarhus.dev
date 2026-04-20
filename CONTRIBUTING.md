# Contributing

## Adding an event

Events are markdown files in `src/content/event/[topic]/` (e.g. `js/`, `rust/`, `ai/`).

**Via GitHub UI:**

1. Go to [`src/content/event/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/event/)
2. Pick a topic folder or create one
3. Click **Add file** → **Create new file**
4. Copy the [template](src/content/event/_template.md), fill in details
5. Commit — creates a PR automatically

**Locally:**

```sh
cp src/content/event/_template.md src/content/event/js/my-event.md
# edit the file
bun run dev    # test
bun run build  # verify
# commit and open a PR
```

## Adding an organizer

Create a file in `src/content/organizer/` using the [template](src/content/organizer/_template.md).

## Development

```sh
bun install
bun run dev          # dev server at localhost:4321
bun run build        # production build
bun run astro check  # type checking
```

## Code style

- PascalCase for components: `MyComponent.astro`
- kebab-case for content: `my-event.md`
- TypeScript with proper types
- Tailwind CSS for styling

## Pull requests

1. Fork and create a branch
2. Make changes, test with `bun run build`
3. Open a PR against `main`

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
