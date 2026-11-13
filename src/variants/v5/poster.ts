// Small helpers for the Poster variant: the ink that reads on a topic color,
// how big a title can be set, and the date strings the posters print.
import type { ADEvent } from '@lib/event'
import { dayNumber, monthShort, topicColor, weekdayShort, yearOf } from '../shared'

/** Black or white — whichever has more contrast on the given color. */
export function inkOn(hex: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return 'var(--color-bg)'
  const n = parseInt(m[1], 16)
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const lum = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  const onBlack = (lum + 0.05) / 0.05
  const onWhite = 1.05 / (lum + 0.05)
  return onBlack >= onWhite ? '#000' : '#fff'
}

/** Inline style that gives an element its topic color (--p) and the ink for it (--p-on). */
export function topicStyle(topic: string): string {
  const color = topicColor(topic)
  return `--p: ${color}; --p-on: ${inkOn(color)}`
}

/**
 * How a title is set: short titles go big and wide, long ones smaller and condensed,
 * so every poster's headline fills about the same block.
 */
export function titleFit(title: string): 'xs' | 's' | 'm' | 'l' {
  const n = title.length
  if (n <= 13) return 'xs'
  if (n <= 22) return 's'
  if (n <= 40) return 'm'
  return 'l'
}

const dayMonth = (d: Date) => `${dayNumber(d)} ${monthShort(d)}`

/** "Thu 19 Nov", "Fri 10 – Sat 11 Apr" for a multi-day event, plus the year when asked. */
export function dateLabel(event: ADEvent, withYear = false): string {
  const { start, end } = event
  let label = `${weekdayShort(start)} ${dayMonth(start)}`
  if (event.data.endDate) {
    const sameMonth = monthShort(start) === monthShort(end)
    const first = sameMonth ? `${weekdayShort(start)} ${dayNumber(start)}` : label
    label = `${first} – ${weekdayShort(end)} ${dayMonth(end)}`
  }
  return withYear ? `${label} ${yearOf(end)}` : label
}

/** The year, when it is not this year — so a poster for next spring says so. */
export const needsYear = (event: ADEvent) => yearOf(event.start) !== yearOf(new Date())

/** "18:00–21:00", "18:00", or "Time TBA" — the poster's date slab. */
export function timeLabel(event: ADEvent): string {
  const { startTime, endTime } = event.data
  if (startTime && endTime) return `${startTime}–${endTime}`
  return startTime ?? 'Time TBA'
}

/** For `<time datetime>`: the exact start, or just the day when the time is not announced. */
export function startStamp(event: ADEvent): string {
  return event.data.startTime ? event.start.toISOString() : event.data.date.toISOString().slice(0, 10)
}
