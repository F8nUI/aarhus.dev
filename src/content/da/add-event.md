---
title: Tilføj et event
description: Sådan kommer dit tech-event på aarhus.dev
---

Alle udvikler- og tech-events i og omkring Aarhus, der er åbne for offentligheden, hører til her — meetups, talk nights, workshops, hackathons og konferencer, gratis eller betalte.

Der er tre måder at tilføje et på. De kræver alle en gratis [GitHub](https://github.com)-konto.

## 1. Udfyld en formular

Åbn et [Add Event-issue](https://github.com/f8nui/aarhus.dev/issues/new?template=add_event.yml), udfyld detaljerne og send det. Formularen er på engelsk, men du må gerne skrive på dansk. En maintainer laver det om til et event på siden. Hverken Git eller Markdown er nødvendigt.

## 2. Tilføj filen på GitHub

1. Åbn emnets mappe under [`src/content/event/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/event/), fx `rust/` eller `ai/`.
2. Klik på **Add file** → **Create new file**.
3. Giv filen navn efter eventet og dets måned: `talk-night-eiva-26-nov.md`. Navnet bliver eventets adresse på siden.
4. Indsæt [skabelonen](#skabelon) og udfyld den.
5. Klik på **Commit changes…** → **Propose changes** → **Create pull request**. Hvis du ikke kan skrive til repositoriet, laver GitHub først en kopi (en fork) til dig.

**Et emne, der ikke findes endnu:** start filnavnet med mappens navn og en skråstreg, fx `python/intro-workshop-27-jan.md`, så opretter GitHub mappen.

Hver pull request bliver tjekket ved at bygge siden med din fil. Hvis tjekket fejler, så klik på **Details**: fejlen nævner filen og feltet. Ret det i den samme pull request. For førstegangsbidragydere venter GitHub på, at en maintainer starter tjekket.

## 3. Arbejd lokalt

```sh
git clone https://github.com/f8nui/aarhus.dev.git
cd aarhus.dev
bun install
bun run dev     # siden på localhost:4321
bun run build   # det samme tjek, som pull requesten kører
```

Tilføj din fil, og åbn så en pull request.

## Skabelon

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

Hvad eventet handler om, i et par korte afsnit. Markdown virker.
```

Skriv teksten på dansk eller engelsk: begge udgaver af siden viser den, som den er skrevet.

## Felter

Påkrævet:

- `organizer` — arrangørens filnavn i [`src/content/organizer/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/organizer/), uden `.md`. Findes den ikke endnu? [Tilføj en](#tilføj-en-arrangør) i den samme pull request.
- `title`
- `date` — `YYYY-MM-DD`. Den første dag, for et event over flere dage.
- `learnMoreURL` — hvor folk tilmelder sig eller læser mere.

Valgfrit:

- `linkFor` — hvad linket er til, hvilket giver det navn på eventets side: `signup` ("Tilmeld dig"), `tickets` ("Billetter") eller `info` ("Læs mere"). Udelad det, så hedder linket "Eventside".
- `subtitle` — en linje under titlen, fx `Morning Meetup`.
- `endDate` — den sidste dag i et event over flere dage.
- `startTime`, `endTime` — lokal tid i Aarhus, 24-timers ur: `18:00`. Udelad det, der ikke er annonceret endnu; siden viser "tid følger".
- `venue` — `title` og `address`. Udelad det, indtil det er annonceret; siden viser "sted følger".
- `highlight: true` — fremhæv eventet som en plakat ved siden af listen (over den på telefoner, på forsiden), indtil det er slut. Når flere er på vej, skiftes de til at blive vist, det første først.

Mappen er eventets emne: alt i `rust/` vises på [aarhus.dev/da/rust](/da/rust). Et nyt emne viser sit mappenavn og en grå prik, indtil det får et visningsnavn og en farve i [`src/lib/topics.ts`](https://github.com/f8nui/aarhus.dev/blob/main/src/lib/topics.ts). Vælg en farve, der er mørk nok til hvid tekst (mindst 4,5:1): event-plakaterne bruger den som baggrund. Hvis "<navn> events" lyder mærkeligt på engelsk, så giv emnet også en `events`-frase, fx `'dev conferences'`. Det danske navn og den danske frase går i `da`, hvor de afviger fra det engelske navn og "<navn>-events".

## Tilføj en arrangør

Én fil pr. fællesskab eller virksomhed i [`src/content/organizer/`](https://github.com/f8nui/aarhus.dev/tree/main/src/content/organizer/). Filnavnet uden `.md` er det id, events henviser til: `rust-aarhus.md` → `organizer: 'rust-aarhus'`.

```yaml
---
name: 'Rust Aarhus'
website: https://www.meetup.com/rust-aarhus/
---

En kort beskrivelse af fællesskabet: hvem det er for, og hvordan dets events er.
```

`website` er valgfrit.

## Når du har sendt det

En maintainer gennemgår hvert issue og hver pull request. Når en pull request er merget, opdateres siden inden for få minutter.

## Spørgsmål?

Åbn et [issue på GitHub](https://github.com/f8nui/aarhus.dev/issues).
