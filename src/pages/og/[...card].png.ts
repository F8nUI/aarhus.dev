// Every page's share card, as /og/<page>.png (src/lib/cards.ts says which card a page
// gets; src/lib/cardImage.ts draws it). Layout.astro points og:image at it.
import type { APIRoute } from 'astro'
import { cardPaths, type Card } from '@lib/cards'
import { cardImage } from '@lib/cardImage'

export const getStaticPaths = cardPaths

export const GET: APIRoute = async ({ props }) => {
  const png = await cardImage((props as { card: Card }).card)
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}
