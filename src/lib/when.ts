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

/**
 * "happening now", "today", "tomorrow", "in 5 days", "in 3 weeks", "2 months ago"; in
 * Danish ('da') "i gang nu", "i dag", "i morgen", "om 5 dage", "om 3 uger", "for 2
 * måneder siden". Self-contained: RuntimeBody ships it to the browser as it is.
 */
export function relativeLabel(start: number, end: number, now: number, lang?: string): string {
  const da = lang === 'da'
  const day = (t: number) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Europe/Copenhagen' })
  if (start <= now && now <= end) return da ? 'i gang nu' : 'happening now'
  const days = Math.round((Date.parse(day(start)) - Date.parse(day(now))) / 864e5)
  if (days === 0) return end < now ? (da ? 'tidligere i dag' : 'earlier today') : da ? 'i dag' : 'today'
  if (days === 1) return da ? 'i morgen' : 'tomorrow'
  if (days === -1) return da ? 'i går' : 'yesterday'
  const n = Math.abs(days)
  const count = n < 14 ? n : n < 60 ? Math.round(n / 7) : Math.round(n / 30)
  const unit = n < 14 ? 0 : n < 60 ? 1 : 2
  // [one, many] of day, week, month
  const units = da
    ? [['dag', 'dage'], ['uge', 'uger'], ['måned', 'måneder']]
    : [['day', 'days'], ['week', 'weeks'], ['month', 'months']]
  const phrase = count + ' ' + units[unit][count === 1 ? 0 : 1]
  if (days > 0) return (da ? 'om ' : 'in ') + phrase
  return da ? 'for ' + phrase + ' siden' : phrase + ' ago'
}
