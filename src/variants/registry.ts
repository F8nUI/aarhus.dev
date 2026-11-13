// The design variants. Every page renders all of them; the overlay (or ?v=N)
// picks which one is visible. v0 is the current design, for comparison.
import V0Shell from './v0/Shell.astro'
import V0List from './v0/List.astro'
import V0Event from './v0/Event.astro'
import V1Shell from './v1/Shell.astro'
import V1List from './v1/List.astro'
import V1Event from './v1/Event.astro'
import V2Shell from './v2/Shell.astro'
import V2List from './v2/List.astro'
import V2Event from './v2/Event.astro'
import V3Shell from './v3/Shell.astro'
import V3List from './v3/List.astro'
import V3Event from './v3/Event.astro'
import V4Shell from './v4/Shell.astro'
import V4List from './v4/List.astro'
import V4Event from './v4/Event.astro'
import V5Shell from './v5/Shell.astro'
import V5List from './v5/List.astro'
import V5Event from './v5/Event.astro'

// Astro components, typed loosely: each variant's props are documented in README.md.
type Component = (props: any) => any

export interface Variant {
  id: string
  name: string
  summary: string
  /** Google Fonts css2 URL, if the variant needs fonts beyond JetBrains Mono. */
  fonts?: string
  Shell: Component
  List: Component
  Event: Component
}

export const variants: Variant[] = [
  { id: 'v0', name: 'Current', summary: 'The site as it is today', Shell: V0Shell, List: V0List, Event: V0Event },
  { id: 'v1', name: 'Variant 1', summary: 'Placeholder', Shell: V1Shell, List: V1List, Event: V1Event },
  { id: 'v2', name: 'Variant 2', summary: 'Placeholder', Shell: V2Shell, List: V2List, Event: V2Event },
  { id: 'v3', name: 'Variant 3', summary: 'Placeholder', Shell: V3Shell, List: V3List, Event: V3Event },
  { id: 'v4', name: 'Variant 4', summary: 'Placeholder', Shell: V4Shell, List: V4List, Event: V4Event },
  { id: 'v5', name: 'Variant 5', summary: 'Placeholder', Shell: V5Shell, List: V5List, Event: V5Event },
]

export const defaultVariant = 'v1'
