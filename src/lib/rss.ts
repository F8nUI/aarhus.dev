// The RSS feed (/rss.xml): every event still to come, so a feed reader shows each newly
// added one as a new item. Items are dated by when the event takes place; the events
// don't record when they were added.
import { formatLong, type ADEvent } from '@lib/event'
import { topicName } from '@lib/topics'

const SITE = 'https://aarhus.dev'

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

function item(event: ADEvent): string {
  const { title, subtitle, venue } = event.data
  const when = formatLong(event)
  const where = venue ? `${venue.title}, ${venue.address}` : 'Venue TBA'
  const facts =
    `<p><strong>${escape(when.date)}${when.time ? `, ${escape(when.time)}` : ''}</strong><br>` +
    `${escape(where)}<br>${escape(event.organizer.data.name)}</p>`
  const body = event.rendered?.html ?? ''
  const link = `${SITE}${event.url}`
  return [
    '<item>',
    `<title>${escape(subtitle ? `${title}: ${subtitle}` : title)}</title>`,
    `<link>${link}</link>`,
    `<guid isPermaLink="true">${link}</guid>`,
    `<pubDate>${event.start.toUTCString()}</pubDate>`,
    `<category>${escape(topicName(event.topic))}</category>`,
    `<description>${cdata(facts + body)}</description>`,
    '</item>',
  ].join('')
}

/** The whole feed, for events oldest first. */
export function rssFeed(events: ADEvent[], now = Date.now()): string {
  const upcoming = events.filter((e) => e.end.valueOf() >= now)
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    '<title>aarhus.dev</title>',
    `<link>${SITE}/</link>`,
    `<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>`,
    '<description>Tech meetups and developer events in Aarhus, Denmark</description>',
    '<language>en</language>',
    `<lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>`,
    ...upcoming.map(item),
    '</channel>',
    '</rss>',
  ].join('\n')
}
