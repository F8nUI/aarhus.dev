---
title: Add Event
description: How to add your tech event to aarhus.dev
---

Events are stored as markdown files in our [GitHub repository](https://github.com/f8nui/aarhus.dev). To add one, you open a pull request.

## Quick way (GitHub UI)

1. Go to [`src/content/event/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/event/) on GitHub
2. Pick a topic folder (`js/`, `rust/`, `swift/`, `ai/`, `dotnet/`, etc.) or create one
3. Click **Add file** → **Create new file**
4. Paste the template below, fill in your event details
5. Commit — GitHub will create a PR automatically

## Template

```yaml
---
organizer: 'organizer-id'
title: "Event Title"
date: 2026-01-01
startTime: 17:00
endTime: 20:00
venue:
  title: 'Venue Name'
  address: 'Street Address, Aarhus'
learnMoreURL: https://example.com/event
---

Event description in markdown.
```

**Fields:**
- `organizer` — must match a file in `src/content/organizer/` (e.g. `rust-aarhus`). Create one if it doesn't exist
- `date` — event date (YYYY-MM-DD)
- `startTime` / `endTime` — 24h format (HH:MM)
- `venue` — name and street address
- `learnMoreURL` — link to RSVP or event page

Optional: `subtitle`, `endDate` (for multi-day events).

## Adding an organizer

Create a file in [`src/content/organizer/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/organizer/):

```yaml
---
name: 'Organizer Name'
website: https://example.com
---

Short description of the community.
```

## Local development

```sh
git clone https://github.com/f8nui/aarhus.dev.git
cd aarhus.dev
bun install
bun run dev     # localhost:4321
bun run build   # verify before PR
```

## Questions?

Open an [issue on GitHub](https://github.com/f8nui/aarhus.dev/issues).
