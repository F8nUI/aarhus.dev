# Event-site research — 2026-11-13

What the best developer-event and conference sites do, what it means for aarhus.dev,
and the five design directions prototyped on this branch (`src/variants/v1`–`v5`).

**Verdict:** the small listings that work (Calagator, dctech.events, confs.tech) win on
plumbing, not looks: real HTML, subscribable calendar feeds, one consistent date line,
structured data. aarhus.dev already has the look; `site-refresh` added the real HTML,
and this branch adds `/calendar.ics`.

**Second round (2026-11-14):** Departure Board (v1) and Poster's head event (v5) were kept. v2–v4 are now
variations that combine them: the first upcoming event marked `highlight: true` is drawn as a flyer, an amber
ticket or a side poster above or beside the board (see `src/variants/README.md`). The first-round Weekly Issue,
Calendar Wall and Topic Lanes are on the branches `design-v2`, `design-v3` and `design-v4`; section C describes
that first round.

## A. Timetable best practices, ranked for aarhus.dev

1. **Calendar feeds — site-wide, per topic, per organizer.** Calagator offers
   `webcal://calagator.org/events.ics` plus a Google subscribe link; dctech.events `/events.ics`;
   events.ccc.de a webcal link; FOSDEM iCal/xCal. → `/calendar.ics` exists on this branch;
   `/rust.ics` and `/organizer/<id>.ics` are the same few lines each.
2. **Real HTML, client JS only for the now/today state.** dctech and Calagator ship full HTML
   with `<time datetime>`; confs.tech and Luma ship an empty shell (a plain fetch of confs.tech
   returns only "confs.tech"). → Done on `site-refresh`.
3. **One date line, every row: weekday · date · 24 h time.** Meetup: "Thu, Nov 19 · 5:00 PM CET".
   aarhus.dev's "wed, 18 nov · 18:00" is right. Avoid dev.events' "Nov 13 26".
4. **Relative groups before month groups.** Calagator: Today / Tomorrow / Next two weeks.
   superscout.co: "This week / Later this month" with a count line. dctech links day headings to
   week pages (`/week/2026-W46/`). → Add *this week* / *next week*.
5. **Topic filters as URLs, with counts.** dev.events chips with counts; dctech `/categories/ai/`.
   Put each topic's feed beside it.
6. **JSON-LD `Event` on every event.** dctech's homepage carries 20 Event objects; Meetup, Luma,
   GOTO and SwiftLeeds do too. Makes events eligible for Google's event results.
7. **Cheap contribution.** confs.tech: JSON PRs. dctech: one YAML per group pointing at its iCal
   feed, and a web form that opens a PR. → Done on `site-refresh` (guide, forms, CI).
8. **A "recently added" RSS feed**, separate from the .ics (dctech: last 30 days). dctech also has
   an "Editor's pick" mark and a 🔄 badge for recurring events.

## B. Event page

Above the fold, in this order (dctech labels them **When** / **Where**):

1. Title and subtitle.
2. **When:** weekday, date, "18:00–21:00", and a status: "in 5 days", "happening now", "ended".
3. **Where:** venue *name*, then the address as a map link. (Meetup: "Danske Commodities" over
   "Kalkværksvej 16 · Aarhus". The current page shows only the address.)
4. Organizer.
5. **A button that names where it goes:** "Sign up on meetup.com →" beats "Attend / Learn more →".
   dctech: "Full details & registration at web.cvent.com →", plus a note that it doesn't run the event.

Also:

- **Add to calendar:** per-event .ics and Google Calendar link, no JS (Calagator: "Export to: Google
  Calendar · iCalendar file"; dctech: "Add to your calendar (.ics)").
- **Map:** link, don't embed (Meetup, dctech, Calagator). Never hide the address (Luma: "Register
  to See Address").
- **Link previews:** put the date in the title (Meetup: "Talk Night at Danske Commodities, Thu,
  Jun 18, 2026, 6:00 PM | Meetup"); Luma generates an 800×420 image per event.
- **Corrections:** dctech "Report an issue with this event", Calagator "edit, clone, or delete"
  → an "Edit on GitHub" link.
- **After the event:** an "ended" banner and the organizer's next event.

## C. Five design directions → the variants

| Variant | Direction | Archetype | Best at | Trade-off |
|---|---|---|---|---|
| **v1** | **Departure Board** | Time-led timetable, status column (NOW · TONIGHT · IN 3D), dense mono, amber-on-black in dark | "What's next?" at a glance — the timetable the name promises | Rows wrap on phones; sparse months look thin |
| **v2** | **Weekly Issue** | Newsletter/editorial: this week + next week as an "issue", then the rest | Habit and shareability — one link a week | Quiet weeks look empty; far-off conferences get buried |
| **v3** | **Calendar Wall** | Month grid, topic-colored dots, pick a day; week strip on phones | Seeing clashes and gaps — organizers avoid double-booking | Empty cells; titles don't fit; weakest on mobile |
| **v4** | **Topic Lanes** | Metro-map timeline, one line per topic, events as stations | Rhythm — who meets monthly, who went quiet | Horizontal scroll; needs a list fallback |
| **v5** | **Poster** | The next event as a gig-flyer hero, compact index below | Sharing and presence, even with few events | One screen per event, slow to scan |

References per direction:

- **Departure Board:** calagator.org, dctech.events (day → time headings), archive.fosdem.org tables,
  this-week-in-rust.org event lines (`2026-11-18 | Hybrid (Vancouver, CA) | Vancouver Rust`).
- **Weekly Issue:** London / Berlin / Amsterdam Tech Events Weekly (buttondown.com), dctech week
  pages, superscout.co, globalnerdy.com's Tampa list.
- **Calendar Wall:** Luma city calendars (day-dot strip on phones), eurorust.eu (schedule as list
  *and* grid), GitHub's contribution graph as a year view.
- **Topic Lanes:** eurorust.eu track grid, archive.fosdem.org by track / by room, zig.day's map header.
- **Poster:** localfirstconf.com (huge headline over a bare date list), ffconf.org (featured talk +
  index), bangbangcon.com, systemsdistributed.com (all-caps status strip "12:00P EST | 6:00P CET").

Works with any of them: a plain-text `/events.txt` in This Week in Rust's pipe format, so
`curl aarhus.dev/events.txt` reads well in a terminal.

## D. Pitfalls seen elsewhere

- **Content behind JS:** confs.tech, Luma, NSSpain, Craft, RustWeek fetched empty; a dev.events
  event page said "Something went wrong while talking to the server".
- **Ambiguous times:** "Nov 13 26" (dev.events), "0900-1000" with no date or zone (HYTRADBOI),
  "Within 18 miles" in Denmark (Meetup).
- **Contradictions:** EuroRust's hero says October 13–16, 2027, its header October 14–17; JSNation's
  2027 page says "This event is over"; Luma shows "Past Event" beside "Join Waitlist". A static
  build bakes in build-time truth → compute status in the browser (done) or rebuild daily.
- **Image-first cards with no time** (Luma, Eventbrite); Eventbrite repeats "Check ticket price on
  event" on every card and listed one event twice.
- **Urgency and upsell:** "Selling fast", "5 seats left", "Boost your event".
- **Dead or stale sites:** Open Tech Calendar closed; Strange Loop's archive returns AccessDenied;
  hacken.in down; luma.com/aarhus empty; Amsterdam Tech Events Weekly silent since May. Keep the
  archive, keep upkeep near zero.

## E. Needs new data (later)

- `series` → 🔄 badge, "next in series" (Swift meetups 9/10/11, ANUG). Berlin.JS: "3rd Thursday each month".
- `status` → cancelled / postponed / full; JSON-LD `eventStatus`.
- `language` → Danish / English (matters here: some groups are "danish speaking").
- `format` → in person / online / hybrid + stream URL; JSON-LD `eventAttendanceMode`.
- `price` / free → superscout's "Free" label.
- A venue collection with coordinates → venue pages, exact map links.
- Structured `speakers` and `program` (already TODOs in `content.config.ts`).
- `cfpUrl`, `cfpEndDate` (confs.tech has them); a `featured` flag.
- Organizer `icalURL` → Meetup groups publish one (`meetup.com/rust-aarhus/events/ical/`), enabling
  dctech-style automatic imports.
- Optional: code-of-conduct URL, accessibility notes (confs.tech's `offersSignLanguageOrCC`), poster image.

## Sites looked at

- **Aggregators:** dev.events, confs.tech (+ GitHub), luma.com (discover, copenhagen, aarhus, nyc-tech,
  one event), meetup.com (find, topics, a Rust Aarhus event + its iCal), eventbrite.dk, superscout.co,
  bushdrum.com, minnestar.org.
- **Community calendars:** calagator.org, dctech.events (+ repo), buttondown.com/londontechevents,
  globalnerdy.com, opentechcalendar.co.uk, hacken.in, this-week-in-rust.org, events.ccc.de.
- **Conferences:** gotocph.com, eurorust.eu, jsnation.com, archive.fosdem.org, laracon.us,
  config.figma.com, swiftheroes.com, swiftleeds.co.uk, tryswift.jp, nsspain.com, craft-conf.com,
  rustweek.org, thestrangeloop.com.
- **Indie:** hytradboi.com, localfirstconf.com, systemsdistributed.com, ffconf.org, deconstructconf.com,
  bangbangcon.com, zig.day, berlinjs.org, handmadecities.com.

JS-rendered pages show nothing visual to a plain fetch, so typefaces came from their CSS
(local-first: Spline Sans + Passion One; EuroRust: Strenuous; ffconf: BasierSquare;
Systems Distributed: Space Grotesk). Luma's timeline view and GOTO's agenda couldn't be seen.
