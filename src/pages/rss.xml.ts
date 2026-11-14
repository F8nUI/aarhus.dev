// Every event still to come, as an RSS feed: https://aarhus.dev/rss.xml
import { getEvents } from '@lib/event'
import { rssFeed } from '@lib/rss'

export async function GET() {
  return new Response(rssFeed(await getEvents()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
