// Display name and dot color for each folder in src/content/event/.
// A folder without an entry still works: it shows its folder name and a neutral dot.
const TOPICS: Record<string, { name: string; color: string }> = {
  ai: { name: 'AI', color: '#d97706' },
  conference: { name: 'Conference', color: '#db2777' },
  devops: { name: 'DevOps', color: '#0d9488' },
  dotnet: { name: '.NET', color: '#512bd4' },
  go: { name: 'Go', color: '#00add8' },
  js: { name: 'JavaScript', color: '#f7df1e' },
  python: { name: 'Python', color: '#3776ab' },
  ruby: { name: 'Ruby', color: '#cc342d' },
  rust: { name: 'Rust', color: '#dea584' },
  security: { name: 'Security', color: '#16a34a' },
  swift: { name: 'Swift', color: '#f05138' },
}

export function topicName(topic: string): string {
  return TOPICS[topic]?.name ?? topic
}

export function topicColor(topic: string): string {
  return TOPICS[topic]?.color ?? 'var(--color-text-muted)'
}
