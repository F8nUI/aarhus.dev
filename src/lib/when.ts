// When an event is, relative to "now". Used twice: at build time for the initial
// HTML, and in the browser on every visit (Runtime.astro injects these functions
// with Function.toString()). So keep each function self-contained: no imports,
// no constants from outside the function body.

/**
 * Space-separated tags for an event, e.g. "upcoming soon tomorrow week".
 *
 * past · upcoming (= not past) · now · today (later today) · soon (after today)
 * tomorrow · week (rest of this Mon–Sun week) · nextweek · later (after next week)
 */
export function whenTags(start: number, end: number, now: number): string {
  const day = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Europe/Copenhagen' })
  const monday = (t: number) => {
    const d = new Date(day(t) + 'T12:00:00Z')
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
    return d.toISOString().slice(0, 10)
  }
  if (end < now) return 'past'
  const tags = ['upcoming']
  if (start <= now) tags.push('now')
  else if (day(start) === day(now)) tags.push('today')
  else {
    tags.push('soon')
    if (day(start) === day(now + 864e5)) tags.push('tomorrow')
    if (monday(start) === monday(now)) tags.push('week')
    else if (monday(start) === monday(now + 7 * 864e5)) tags.push('nextweek')
    else tags.push('later')
  }
  return tags.join(' ')
}

/** "happening now", "today", "tomorrow", "in 5 days", "in 3 weeks", "2 months ago". */
export function relativeLabel(start: number, end: number, now: number): string {
  const day = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Europe/Copenhagen' })
  if (start <= now && now <= end) return 'happening now'
  const days = Math.round((Date.parse(day(start)) - Date.parse(day(now))) / 864e5)
  if (days === 0) return end < now ? 'earlier today' : 'today'
  if (days === 1) return 'tomorrow'
  if (days === -1) return 'yesterday'
  const n = Math.abs(days)
  const count = n < 14 ? n : n < 60 ? Math.round(n / 7) : Math.round(n / 30)
  const unit = n < 14 ? 'day' : n < 60 ? 'week' : 'month'
  const phrase = count + ' ' + unit + (count === 1 ? '' : 's')
  return days > 0 ? 'in ' + phrase : phrase + ' ago'
}
