// Shown in the debug overlay. fonts: a Google Fonts css2 URL, if the variant needs one.
// The same URL as Departure Board's, so it loads once.
export default {
  name: 'Board + Ticket',
  summary: 'The Departure Board, with the highlighted event as a big amber ticket on top',
  fonts: 'https://fonts.googleapis.com/css2?family=Big+Shoulders:opsz,wght@10..72,700..800&display=swap' as
    | string
    | undefined,
}
