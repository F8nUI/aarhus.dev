// Shown in the debug overlay. fonts: a Google Fonts css2 URL, if the variant needs one.
// Archivo for the flyer — the same URL as Poster's, so it loads once. The board's
// Big Shoulders comes with Departure Board's entry.
export default {
  name: 'Board + Flyer',
  summary: 'The Departure Board, with the highlighted event as a gig flyer on top',
  fonts:
    'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Spline+Sans+Mono:wght@300..700&display=swap' as
      | string
      | undefined,
}
