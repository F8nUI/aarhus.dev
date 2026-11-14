// Draws a share card (src/lib/cards.ts) as a 1200×630 PNG: satori lays it out with the
// site's fonts (src/assets/fonts/, bundled into the build as data) and turns it into an
// SVG of shapes, and sharp turns that into a PNG. The look follows the featured posters: the
// topic's color with white for an event or a topic, the dark board's navy and amber
// for an organizer and the site's own pages.
import satori from 'satori'
import sharp from 'sharp'
import type { Card } from '@lib/cards'
import { dayNumber, monthShort, timeRange, titleFit, weekdayShort, yearOf } from '@lib/format'
import { t } from '@lib/i18n'
import { topicColor, topicName } from '@lib/topics'
import mono400 from '../assets/fonts/jetbrains-mono-400.ttf?inline'
import mono800 from '../assets/fonts/jetbrains-mono-800.ttf?inline'
import plex400 from '../assets/fonts/plex-sans-condensed-400.ttf?inline'
import plex700 from '../assets/fonts/plex-sans-condensed-700.ttf?inline'

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

// the dark theme's board (global.css)
const NAVY = '#0b1322'
const AMBER = '#f7b538'
const WHITE = '#f3f6fb'
const MUTED = '#8f9cb3'

// ---- the element tree satori takes, written without React --------------------------

type Style = Record<string, string | number>
type Child = Node | string | null | false | undefined
type Node = { type: string; props: { style: Style; children?: Child | Child[] } }

/**
 * An element: h({ fontSize: 40 }, 'text', h(…)). Elements are flex rows unless the
 * style says otherwise, and their width and height include their padding.
 */
function h(style: Style, ...children: Child[]): Node {
  const kids = children.filter((c) => c !== null && c !== false && c !== undefined)
  const base: Style = { display: 'flex', boxSizing: 'border-box' }
  return { type: 'div', props: { style: { ...base, ...style }, children: kids.length === 1 ? kids[0] : kids } }
}

/** A topic color lightened toward white, so a dot shows on the navy. */
function lighten(hex: string, amount = 0.35): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return MUTED
  const mix = (i: number) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount) + 255 * amount)
  return `rgb(${mix(1)}, ${mix(3)}, ${mix(5)})`
}

const logo = (size: number, color: string, cursor: string) =>
  h(
    { alignItems: 'flex-end', fontFamily: 'Mono', fontWeight: 800, fontSize: size, color, lineHeight: 1 },
    'aarhus.dev',
    h({ width: size * 0.6, height: size * 1.05, marginLeft: size * 0.12, marginBottom: -size * 0.12, backgroundColor: cursor }),
  )

const label = (text: string, color: string) =>
  h({ fontSize: 24, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color }, text)

/** A big title, sized by its length like the posters' (FeaturedPoster.astro). */
function title(text: string, uppercase = true): Node {
  const size = { xs: 128, s: 108, m: 86, l: 66 }[titleFit(text)]
  return h(
    {
      display: 'block',
      fontSize: size,
      fontWeight: 700,
      lineHeight: 0.95,
      letterSpacing: '0.005em',
      textTransform: uppercase ? 'uppercase' : 'none',
      lineClamp: 3,
    },
    text,
  )
}

const topicDots = (topics: string[], lang: Card['lang'], color: string) =>
  h(
    { flexWrap: 'wrap', columnGap: 28, rowGap: 10, fontSize: 26, color },
    ...[...topics]
      .sort((a, b) => topicName(a, lang).localeCompare(topicName(b, lang), lang))
      .map((topic) =>
      h(
        { alignItems: 'center' },
        h({ width: 16, height: 16, borderRadius: 8, marginRight: 10, backgroundColor: lighten(topicColor(topic)) }),
        topicName(topic, lang),
      ),
    ),
  )

/** The frame every card shares: a top strip (logo and a label) over a rule, the body, and a foot over a rule. */
function frame(colors: { bg: string; ink: string; accent: string }, strip: string, body: Node, foot: Node): Node {
  return h(
    {
      flexDirection: 'column',
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      padding: '48px 64px 52px',
      backgroundColor: colors.bg,
      color: colors.ink,
      fontFamily: 'Plex',
    },
    h(
      { justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: `4px solid ${colors.ink}` },
      logo(30, colors.ink, colors.accent),
      label(strip, colors.ink),
    ),
    h({ flexDirection: 'column', flexGrow: 1, paddingTop: 34 }, body),
    h({ paddingTop: 22, borderTop: `4px solid ${colors.ink}` }, foot),
  )
}

// ---- the four kinds ------------------------------------------------------------------

function eventCard(card: Extract<Card, { kind: 'event' }>): Node {
  const { event, lang } = card
  const w = t(lang)
  const { title: name, subtitle, venue } = event.data
  const d = event.start
  const year = yearOf(d) === yearOf(new Date()) ? '' : ` ${yearOf(d)}`
  const time = timeRange(event, lang)
  const fact = (head: string, value: string) =>
    h(
      { flexDirection: 'column', width: 290 },
      h({ fontSize: 24, fontWeight: 400, opacity: 0.75, marginBottom: 6 }, head),
      h({ display: 'block', fontSize: 32, fontWeight: 700, lineHeight: 1.1, lineClamp: 2 }, value),
    )
  return frame(
    { bg: topicColor(event.topic), ink: '#ffffff', accent: '#ffffff' },
    topicName(event.topic, lang),
    h(
      { flexDirection: 'column' },
      title(name),
      subtitle ? h({ fontSize: 38, fontWeight: 400, marginTop: 14 }, subtitle) : null,
    ),
    h(
      { width: '100%', justifyContent: 'space-between', alignItems: 'center' },
      h(
        { alignItems: 'center', flexShrink: 0 },
        h({ fontSize: 124, fontWeight: 700, lineHeight: 0.8, letterSpacing: '-0.02em', marginRight: 22 }, dayNumber(d)),
        h(
          { flexDirection: 'column', fontSize: 42, fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' },
          `${weekdayShort(d, lang)} ${monthShort(d, lang)}${year}`,
          h({ marginTop: 6, opacity: time ? 1 : 0.7 }, time || w.timeTba),
        ),
      ),
      h({ columnGap: 32 }, fact(w.where, venue?.title ?? w.venueTba), fact(w.organizer, event.organizer.data.name)),
    ),
  )
}

function topicCard(card: Extract<Card, { kind: 'topic' }>): Node {
  return frame(
    { bg: topicColor(card.topic), ink: '#ffffff', accent: '#ffffff' },
    topicName(card.topic, card.lang),
    title(card.title),
    h({ fontFamily: 'Mono', fontSize: 30 }, card.url),
  )
}

function organizerCard(card: Extract<Card, { kind: 'organizer' }>): Node {
  return frame(
    { bg: NAVY, ink: AMBER, accent: AMBER },
    t(card.lang).organizer,
    h({ color: WHITE }, title(card.name, false)),
    h(
      { flexDirection: 'column' },
      topicDots(card.topics, card.lang, WHITE),
      h({ fontFamily: 'Mono', fontSize: 26, color: MUTED, marginTop: 18 }, card.url),
    ),
  )
}

function siteCard(card: Extract<Card, { kind: 'site' }>): Node {
  return h(
    {
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      padding: '64px 64px 52px',
      backgroundColor: NAVY,
      color: WHITE,
      fontFamily: 'Plex',
    },
    h(
      { flexDirection: 'column' },
      logo(112, WHITE, AMBER),
      h({ fontSize: 60, fontWeight: 700, marginTop: 34, color: AMBER }, card.title),
    ),
    h(
      { flexDirection: 'column', paddingTop: 24, borderTop: `4px solid ${AMBER}` },
      topicDots(card.topics, card.lang, WHITE),
      h({ fontFamily: 'Mono', fontSize: 26, color: MUTED, marginTop: 20 }, card.url),
    ),
  )
}

// ---- drawing ---------------------------------------------------------------------------

// each font arrives as a data: URL (Vite's ?inline); satori wants the bytes
const bytes = (dataUrl: string) => Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0)).buffer
const fonts: Parameters<typeof satori>[1]['fonts'] = [
  { name: 'Plex', data: bytes(plex400), weight: 400, style: 'normal' },
  { name: 'Plex', data: bytes(plex700), weight: 700, style: 'normal' },
  { name: 'Mono', data: bytes(mono400), weight: 400, style: 'normal' },
  { name: 'Mono', data: bytes(mono800), weight: 800, style: 'normal' },
]

/** The card as a PNG. */
export async function cardImage(card: Card): Promise<Uint8Array<ArrayBuffer>> {
  const tree =
    card.kind === 'event'
      ? eventCard(card)
      : card.kind === 'topic'
        ? topicCard(card)
        : card.kind === 'organizer'
          ? organizerCard(card)
          : siteCard(card)
  // satori's types expect React elements; the tree has the same shape
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts,
  })
  return new Uint8Array(await sharp(new TextEncoder().encode(svg)).png().toBuffer())
}
