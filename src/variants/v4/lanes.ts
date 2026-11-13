// Topic Lanes: the build-time geometry of the line map and the small
// formatting helpers the three components share.
import type { ADEvent } from '@lib/event'
import { dayNumber, monthShort, topicColor, weekdayShort } from '../shared'

const DAY = 864e5
const CPH = 'Europe/Copenhagen'

/** Map scale and lane geometry, in px. The CSS reads the same numbers from inline styles. */
export const MAP = {
  pxPerDay: 9,
  padLeft: 28,
  padRight: 220,
  laneHeight: 52,
  lineY: 26,
  minGap: 16, // two stations on one line never sit closer than this
}

// --- Colors ----------------------------------------------------------------

const hex = (c: string) => /^#[0-9a-f]{6}$/i.test(c)
const channels = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const toHex = (rgb: number[]) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

function luminance(c: string): number {
  const [r, g, b] = channels(c).map((v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const DARK_INK = '#14181d'
const DARK_INK_L = luminance(DARK_INK)

/** White or near-black, whichever reads better on this color. */
function inkOn(c: string): string {
  const l = luminance(c)
  return 1.05 / (l + 0.05) >= (l + 0.05) / (DARK_INK_L + 0.05) ? '#ffffff' : DARK_INK
}

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const mix = (c: string, toward: number, t: number) => toHex(channels(c).map((v) => v + (toward - v) * t))

/** Move a colour toward black or white, a step at a time, until it stands out from `surface` (or the step cap is hit). */
function legible(c: string, surface: string, toward: 0 | 255, target: number, cap: number): string {
  let out = c
  for (let t = 0; t <= cap && contrast(out, surface) < target; t += 0.02) out = mix(c, toward, t)
  return out
}

/**
 * Inline custom properties for one topic's line: --c (light) and --cd (dark),
 * each nudged only as far as needed to read on that theme's map, plus the text
 * colour to put on each. Pair with class "v4-c".
 */
export function lineVars(topic: string): string {
  const c = topicColor(topic)
  if (!hex(c)) return `--c:${c};--cd:${c};--ik:var(--color-bg);--ikd:var(--color-bg)`
  const light = legible(c, '#ffffff', 0, 2.6, 0.2)
  const dark = legible(mix(c, 255, 0.1), '#22262b', 255, 3.6, 0.4)
  return `--c:${light};--cd:${dark};--ik:${inkOn(light)};--ikd:${inkOn(dark)}`
}

// --- Dates -----------------------------------------------------------------

/** "2026-11-19" in Aarhus. */
export const cphDay = (t: number | Date) => new Date(t).toLocaleDateString('en-CA', { timeZone: CPH })

/** The instant of Aarhus midnight on a calendar day. */
function cphMidnight(y: number, m: number, d = 1): number {
  const utc = Date.UTC(y, m - 1, d)
  const name = new Intl.DateTimeFormat('en-US', { timeZone: CPH, timeZoneName: 'longOffset' })
    .formatToParts(new Date(utc + 12 * 36e5))
    .find((p) => p.type === 'timeZoneName')!.value
  const match = /([+-])(\d\d):(\d\d)/.exec(name)
  const offset = match ? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3])) : 60
  return utc - offset * 6e4
}

/** The date line every row uses: weekday, date, 24 h start (or TBA), and a datetime for <time>. */
export function dateLine(event: ADEvent) {
  const { date, startTime } = event.data
  return {
    datetime: startTime ? event.start.toISOString() : date.toISOString().slice(0, 10),
    day: `${weekdayShort(event.start)} ${dayNumber(event.start)} ${monthShort(event.start)}`,
    time: startTime ?? 'TBA',
  }
}

/** Where the station sits in time, at build time; the page script redoes this in the browser. */
export function stateAt(event: ADEvent, now: number): 'past' | 'now' | 'today' | 'upcoming' {
  const start = event.start.valueOf()
  const end = event.end.valueOf()
  if (end < now) return 'past'
  if (start <= now) return 'now'
  return cphDay(start) === cphDay(now) ? 'today' : 'upcoming'
}

/** A station name short enough for the map: the part before a colon or dash, when that part says enough. */
export function shortTitle(title: string): string {
  const m = /^(.{8,}?)(?:\s+[—–-]\s+|:\s+)/.exec(title)
  return m ? m[1] : title
}

// --- The map ---------------------------------------------------------------

export interface Station {
  event: ADEvent
  x: number
  short: string
  /** 0: label above the line, 1: below, null: no room (name shows on hover / focus). */
  row: 0 | 1 | null
  /** Label width budget in px. */
  w: number
}

export interface Lane {
  topic: string
  stations: Station[]
  x0: number
  x1: number
}

export interface MapLayout {
  t0: number
  t1: number
  width: number
  lanes: Lane[]
  months: { t: number; x: number; label: string; year?: string }[]
  x: (t: number) => number
}

// Rough advance width of the label face (Barlow Semi Condensed 600, 12.5 px).
const labelWidth = (s: string) => Math.ceil(s.length * 6.3) + 4
const LABEL_MIN = 48
const LABEL_MAX = 200
const LABEL_GAP = 10
const LABEL_LEAD = 6 // a label starts this far left of its station's centre

export function layoutMap(events: ADEvent[], topics: string[]): MapLayout {
  const first = events[0].start
  const last = events.reduce((a, e) => Math.max(a, e.end.valueOf()), 0)
  const [fy, fm] = cphDay(first).split('-').map(Number)
  const [ly, lm] = cphDay(last).split('-').map(Number)
  const t0 = cphMidnight(fy, fm)
  const t1 = cphMidnight(lm === 12 ? ly + 1 : ly, lm === 12 ? 1 : lm + 1)
  const x = (t: number) => MAP.padLeft + ((t - t0) / DAY) * MAP.pxPerDay
  const width = Math.ceil(x(t1) + MAP.padRight)

  const months: MapLayout['months'] = []
  for (let y = fy, m = fm; ; ) {
    const t = cphMidnight(y, m)
    if (t > t1) break
    months.push({
      t,
      x: x(t),
      label: new Date(t + 12 * 36e5).toLocaleDateString('en-GB', { month: 'short', timeZone: CPH }).replace('Sept', 'Sep'),
      year: m === 1 || months.length === 0 ? String(y) : undefined,
    })
    if (m === 12) {
      y++
      m = 1
    } else m++
  }

  const lanes = topics.map((topic) => {
    const stations: Station[] = []
    for (const event of events.filter((e) => e.topic === topic)) {
      const prev = stations.at(-1)
      const at = Math.max(x(event.start.valueOf()), prev ? prev.x + MAP.minGap : 0)
      stations.push({ event, x: at, short: shortTitle(event.data.title), row: null, w: 0 })
    }
    placeLabels(stations, width)
    return {
      topic,
      stations,
      x0: (stations[0]?.x ?? 0) - 14,
      x1: (stations.at(-1)?.x ?? 0) + 14,
    }
  })

  return { t0, t1, width, lanes, months, x }
}

// Two label rows per line, above and below. Each station takes the first row
// whose previous label already ends in time; failing that, it shortens the
// previous label in whichever row leaves it longer, if that keeps it readable;
// failing that, it goes unlabeled and shows its name on hover and focus.
function placeLabels(stations: Station[], width: number) {
  const last: (Station | null)[] = [null, null]
  for (const s of stations) {
    const start = s.x - LABEL_LEAD
    const want = Math.min(LABEL_MAX, labelWidth(s.short), width - start - 8)
    const ends = (p: Station | null) => (p ? p.x - LABEL_LEAD + p.w + LABEL_GAP : -Infinity)
    let row: 0 | 1 | null = ends(last[0]) <= start ? 0 : ends(last[1]) <= start ? 1 : null
    if (row === null) {
      const room = last.map((p) => (p ? start - LABEL_GAP - (p.x - LABEL_LEAD) : Infinity))
      const best = room[0] >= room[1] ? 0 : 1
      if (room[best] >= LABEL_MIN) {
        last[best]!.w = room[best]
        row = best
      }
    }
    if (row !== null) {
      s.row = row
      s.w = want
      last[row] = s
    }
  }
}
