# Claude-Specific Context

See [`agents.md`](./agents.md) for the main project context that applies to all AI assistants.

## Claude-Specific Tips

### Working with Content Collections

When reading or modifying content files, use the Read tool to examine existing event/organizer files as examples before creating new ones.

### Component Development

- Use Read to examine existing `.astro` and `.tsx` components in `src/components/` before creating new ones
- Astro components support both static and interactive (Preact) sections
- Check `src/layouts/Layout.astro` for the base layout structure

### Testing Changes

After making changes:
1. Use `bun run dev` to start the dev server
2. Test in browser at `localhost:4321`
3. Run `bun run build` to ensure production build works

### File Operations

- Use Edit tool for modifying existing files (preferred)
- Use Write tool only for new files
- Always read files before editing to understand current structure

### Content Schema

Before adding/modifying content files, check:
- Existing files in `src/content/event/[lang]/` for event format
- Existing files in `src/content/organizer/` for organizer format
- Template files for required frontmatter fields

### Helpful Commands

```sh
# Type checking
bun run astro check

# Add integrations
bun run astro add [integration-name]
```
