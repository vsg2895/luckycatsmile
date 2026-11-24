/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that LUCK IS THE WRONG WORD for choosing a casino, because
 * the four numbers that decide it are all published. Its siblings answer the
 * neighbouring questions (affliliate: what an offer is worth in money;
 * slottering: the slot rules; bettingbetway: which casino to trust;
 * bonanzasmile: the catch in a bonus; gladjackpot: how the money gets out) and
 * none of them may be echoed.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's FAQ says
 * "we open real accounts, deposit, claim the bonus and request a withdrawal"
 * and "we publish the times we observed". Neither ships, in any wording:
 * nothing in this project records a funded account or a timed payment, and the
 * answer below that is asked about payout speed says so outright rather than
 * quietly implying otherwise.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank casinos?',
    answer:
      'On four published figures, read the same way for every operator. The regulator named on the licence; the wagering multiplier and what it applies to; the ceiling on a single withdrawal and on a month; and the processing window the cashier page commits to in writing. A casino that states all four plainly and sets them at ordinary levels ranks above one that leaves them vague, whatever its welcome bonus looks like.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not measure. Everything here is read from what the operator publishes — the terms page, the cashier page, the licence. Where a casino commits to a payout window we quote that commitment and say it is theirs; where it commits to nothing, the review says so, which is itself one of the more useful things to know before depositing.',
  },
  {
    question: 'Is a casino ever really “lucky”?',
    answer:
      'No. Every game has a house edge the operator publishes, and over any length of time that edge is what decides the outcome — not a streak, not a machine being due, and not a charm. What varies between casinos is everything around the game: how much you must wager before a bonus win becomes yours, how fast and in what size payments leave, and who you can complain to. Those are the things worth choosing on, and they are the things this site lists.',
  },
  {
    question: 'What makes one wagering requirement worse than another?',
    answer:
      'The multiplier is only half of it. 30x on the bonus alone and 30x on deposit plus bonus are different obligations, and a requirement that excludes the games with the best returns is harder than its number suggests. We record the multiplier, what it is applied to and which games count, because an offer is only as good as the combination.',
  },
  {
    question: 'Why does the licence matter so much here?',
    answer:
      'Because it decides what happens when something goes wrong. A licence names the body you can complain to, the rules the operator agreed to follow and, in most jurisdictions, a free dispute service that can order a payment. Without one there is no route at all beyond the operator’s own support desk. We name the regulator on every review so the claim can be checked rather than taken on trust.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may earn a commission when someone signs up through a link on this site, and that is how it is funded. It does not buy a position: the ranking comes from the four published figures above, every operator is read the same way, and a casino that tightens its terms moves down whether or not it pays us.',
  },
] as const
