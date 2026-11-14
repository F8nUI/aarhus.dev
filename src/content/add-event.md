---
title: Add Event
description: How to get your tech event on aarhus.dev
---

Any developer or tech event in or around Aarhus that is open to the public belongs here — meetups, talk nights, workshops, hackathons and conferences, free or paid.

There are three ways to add one. All of them need a free [GitHub](https://github.com) account.

## 1. Fill in a form

Open an [Add Event issue](https://github.com/f8nui/aarhus.dev/issues/new?template=add_event.yml), fill in the details and submit it. A maintainer turns it into an event on the site. No Git or Markdown needed.

## 2. Add the file on GitHub

1. Open the topic folder under [`src/content/event/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/event/), such as `rust/` or `ai/`.
2. Click **Add file** → **Create new file**.
3. Name the file after the event and its month: `talk-night-eiva-26-nov.md`. The name becomes the event's address on the site.
4. Paste the [template](#template) and fill it in.
5. Click **Commit changes…** → **Propose changes** → **Create pull request**. If you can't write to the repository, GitHub makes a copy (a fork) for you first.

**A topic that isn't there yet:** start the file name with the folder name and a slash, for example `python/intro-workshop-27-jan.md`, and GitHub creates the folder.

A maintainer checks every pull request before merging it and fixes small mistakes. To check your file yourself first, build the site locally (below): a mistake in an event file stops the build, naming the file and the field.

## 3. Work locally

```sh
git clone https://github.com/f8nui/aarhus.dev.git
cd aarhus.dev
bun install
bun run dev     # the site at localhost:4321
bun run build   # stops at a mistake in an event file, naming the file and the field
```

Add your file, then open a pull request.

## Template

```yaml
---
organizer: 'rust-aarhus'
title: 'Talk Night at EIVA'
date: 2026-11-19
startTime: 18:00
endTime: 21:00
venue:
  title: 'EIVA'
  address: 'Niels Bohrs Vej 17, 8660 Skanderborg'
learnMoreURL: https://www.meetup.com/rust-aarhus/events/316938696/
linkFor: signup
---

What the event is about, in a few short paragraphs. Markdown works.
```

Write the text in English or Danish: both versions of the site show it as written.

## Fields

Required:

- `organizer` — the organizer's file name in [`src/content/organizer/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/organizer/), without `.md`. Not there yet? [Add one](#adding-an-organizer) in the same pull request.
- `title`
- `date` — `YYYY-MM-DD`. The first day, for an event that runs several days.
- `learnMoreURL` — where people sign up or read more.

Optional:

- `linkFor` — what the link is for, which names it on the event's page: `signup` ("Sign up"), `tickets` ("Get tickets") or `info` ("Read more"). Leave it out and the link says "Event page".
- `subtitle` — a line under the title, such as `Morning Meetup`.
- `endDate` — the last day of a multi-day event.
- `startTime`, `endTime` — Aarhus local time, 24-hour: `18:00`. Leave out what isn't announced yet; the site shows "time TBA".
- `venue` — `title` and `address`. Leave it out until it's announced; the site shows "venue TBA".
- `highlight: true` — feature the event as a poster beside the list (above it on phones, on the home page) until it has ended. When several are coming up, they take turns, soonest first.

The folder is the event's topic: everything in `rust/` is listed at [aarhus.dev/rust](/rust). A new topic shows its folder name and a grey dot until it gets a display name and a color in [`src/lib/topics.ts`](https://github.com/f8nui/aarhus.dev/blob/main/src/lib/topics.ts). Pick a color dark enough for white text on it (at least 4.5:1): event posters use it as their background. If "<name> events" reads oddly, give the topic an `events` phrase too, such as `'dev conferences'`. Its Danish name and phrase go in `da`, where they differ from the English name and "<name>-events".

## Adding an organizer

One file per community or company in [`src/content/organizer/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/organizer/). Its file name, without `.md`, is the id events refer to: `rust-aarhus.md` → `organizer: 'rust-aarhus'`.

```yaml
---
name: 'Rust Aarhus'
website: https://www.meetup.com/rust-aarhus/
---

A short description of the community: who it's for and what its events are like.
```

`website` is optional.

## After you submit

A maintainer reviews every issue and pull request. Once a pull request is merged, the site updates within a few minutes.

## Questions?

Open an [issue on GitHub](https://github.com/f8nui/aarhus.dev/issues).
