// Display name and color for each folder in src/content/event/, and optionally what
// to call its events when "<name> events" reads oddly ("dev conferences", not
// "Conference events"): it names the topic's page ("Dev conferences in Aarhus"),
// its archive ("Past dev conferences") and the way back from an event.
// A folder without an entry still works: it shows its folder name and a neutral dot.
// Every color is dark enough for white text on it (at least 4.5:1): the featured
// posters set their title, date and details in white on the topic's color.
const TOPICS: Record<string, { name: string; color: string; events?: string }> = {
  ai: { name: 'AI', color: '#b16002' },
  conference: { name: 'Conference', color: '#d92576', events: 'dev conferences' },
  devops: { name: 'DevOps', color: '#078379' },
  dotnet: { name: '.NET', color: '#512bd4' },
  go: { name: 'Go', color: '#087f9f' },
  js: { name: 'JavaScript', color: '#827406' },
  python: { name: 'Python', color: '#3776ab' },
  ruby: { name: 'Ruby', color: '#cc342d' },
  rust: { name: 'Rust', color: '#9d6849' },
  security: { name: 'Security', color: '#018639' },
  swift: { name: 'Swift', color: '#d93921' },
}

/** What to call the topic's events, mid-sentence: "Swift events", "dev conferences". */
export function topicEvents(topic: string): string {
  return TOPICS[topic]?.events ?? `${topicName(topic)} events`
}

/** The same at the start of a sentence: "Dev conferences". */
export function topicEventsTitle(topic: string): string {
  const s = topicEvents(topic)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function topicName(topic: string): string {
  return TOPICS[topic]?.name ?? topic
}

export function topicColor(topic: string): string {
  return TOPICS[topic]?.color ?? 'var(--color-text-muted)'
}
