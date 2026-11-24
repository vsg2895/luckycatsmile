/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * luckycatsmile's angle: LUCK IS THE WRONG WORD. Its unit is the NUMBER YOU
 * CAN LOOK UP. A casino is not lucky or unlucky — it has a wagering
 * multiplier, a payout schedule, a withdrawal limit and a regulator, and all
 * four are published if anyone bothers to read them. This site reads them and
 * sets them beside each other, so the choosing is done before the gambling
 * starts. The beckoning cat is the joke the brand is in on: you are meant to
 * need the lucky charm, and here you do not. Its siblings answer the
 * neighbouring questions — affliliate decodes an offer in MONEY, slottering
 * reads the SLOT rules, bettingbetway ranks CASINOS on their terms,
 * bonanzasmile names the CATCH, gladjackpot asks how the money gets OUT — and
 * none of them may be echoed.
 *
 * ── Three lines this file does not cross ────────────────────────────────────
 * 1. The mockup's lead says "we play, claim and cash out at every casino we
 *    list", and its FAQ promises "the times we observed". NEITHER SHIPS, in
 *    any wording: nothing in this project records a funded account, a played
 *    bonus or a timed withdrawal, and a review site inventing its own test
 *    results is the one failure that cannot be walked back. What the site can
 *    honestly say is that it reads what each operator publishes, and that is
 *    what the copy says.
 * 2. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 3. The mockup prints a "Min. deposit" per casino and per top-three row.
 *    There is no such column, so no wording promises one; the slot carries the
 *    rating, which is real.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Casinos Read, Not Guessed',
    description:
      'sets the published numbers side by side — wagering, payout schedule, limits and licence — so picking a casino stops being a gamble before the gambling starts.',
    keywords: [
      'casino wagering requirements compared',
      'casino payout schedules',
      'licensed online casinos',
      'casino bonus terms explained',
      'how to choose an online casino',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    bonus: 'Bonuses',
    // The line under the Bonuses heading — the mockup's "Fortune slips worth
    // opening", which is also what the cards are shaped like.
    bonusesSubtitle: 'Fortune slips worth opening.',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Browse by bonus type',
    heroEyebrow: 'Fresh fortunes every week',
    // Split in two so the JSX keeps its emphasised highlight while the words
    // change. The highlight is the brand's own phrase.
    // Split in three so the JSX can set the middle phrase in the serif's TRUE
    // italic, which is the hero's whole device.
    heroHeadline: 'Casinos that need no',
    heroHighlight: 'luck at all.',
    heroHeadlineTail: '',
    heroSubtitle:
      'A casino is not lucky or unlucky. It has a wagering multiplier, a payout schedule, a withdrawal limit and a regulator, and every one of them is published. We read all four and set them beside each other, so the choosing is done before the gambling starts.',
    // The head of the hero's top-three card, and the label over its right-hand
    // column. The mockup's column is "Min. deposit"; nothing in the API holds
    // one, so the slot carries the rating.
    // The badge above the slip's heading, and the line under it. Both are the
    // mockup's own; the badge carries the live dot.
    podiumBadge: 'Updated weekly',
    podiumTitle: 'Lucky picks this week',
    // The mockup says "three casinos that paid out fastest in our latest
    // tests". There are no tests and no payout times here, so this says what
    // the list actually is: the top of the current ranking.
    podiumSubtitle: 'The three highest-placed casinos in this week’s ranking.',
    podiumRatingLabel: 'Rating',
    podiumAll: 'See full rankings',
    // There are no `bandPhrases` on this site: the sibling affliliate slides a
    // marquee under its hero, and this design closes the hero with a wave
    // instead. The key is gone rather than left for a component that no longer
    // reads it.
    topCasinosTitle: 'Casinos worth the stake',
    topCasinosSubtitle: 'Ordered by what their own pages say about wagering, payouts and licensing. Filter by category.',
    featuredCasinos: 'See top casinos',
    specialOffers: 'Browse bonuses',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Online Casinos Compared On Their Own Numbers',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'What we read, what we will not claim, and how a casino earns its place here.',
    metaDescription:
      'Online casinos compared on their own published numbers — wagering multipliers, payout schedules, withdrawal limits and the regulator behind each licence.',
    // ── The "How we rank a casino" band ───────────────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How a casino earns its place',
    methodSubtitle: 'Three readings of what the operator itself publishes, in this order.',
    methodSteps: [
      {
        no: '01',
        verb: 'Read',
        title: 'The licence first',
        body:
          'Before the bonus, the regulator: which authority the operator names, what that authority requires of it, and whether there is a free dispute service behind the claim. A casino that names none starts and stays at the bottom.',
      },
      {
        no: '02',
        verb: 'Compare',
        title: 'The numbers, side by side',
        body:
          'The wagering multiplier and what it applies to, the withdrawal ceiling per payment and per month, and the processing window the cashier page commits to. Four published figures, read the same way for every operator.',
      },
      {
        no: '03',
        verb: 'Re-read',
        title: 'Again, later',
        body:
          'Terms change quietly. Lapsed offers come off the board, revised ones are read again, and a casino moves when its numbers move — up as well as down.',
      },
    ],
    methodLabel: 'How it works',
    // Under the three stages: the cycle closes back on the first.
    methodLoop: 'And back to the first reading whenever an operator rewrites its terms',
    // ── The hero monitor: what one pass re-reads ─────────────────────────
    // The same three things the FAQ and the method name — no figure this
    // site does not hold.
    monitorTitle: 'What each reading covers',
    monitorStatus: 'Weekly',
    monitorReads: [
      { label: '01 · The licence', text: 'Which regulator the operator names' },
      { label: '02 · The wagering', text: 'The multiplier, and what it applies to' },
      { label: '03 · The payout', text: 'Ceiling per payment, and the window' },
    ],
    monitorNote: 'A casino moves when its numbers move. Lapsed bonuses come off the board.',
    rankingLabel: 'The rankings',
    bonusTypesKicker: 'By type',
    bonusesLabel: 'The offers',
    faqLabel: 'Answered',
  },
  casinos: {
    pageTitle: 'Every Casino We List',
    pageDescription:
      'The full list, each casino shown with the bonus it is running, the figures its own pages publish, and where it places in its category.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Other casinos worth a look',
    reviewTitleTail: 'Wagering, Payouts And Licence',
    reviewSignature: 'Every figure here read from this operator’s own terms and banking pages.',
    reviewSummary: 'with its wagering, payout schedule, withdrawal limits and regulator read from the operator’s own pages rather than its banner.',
    // The ribbon on the leading casino card. A WORD, not a numeral: the list
    // order already is the ranking, and a "1" on every card invites reading it
    // as a score.
    topPick: 'Top pick',
    visitCasino: 'Open Casino',
    readReview: 'Read review',
    rating: 'Lucky score',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind we list right now, with whose offer it is and the wagering that decides what it is worth.',
    countOne: 'bonus',
    countMany: 'bonuses',
  },

  specialOffers: {
    pageTitle: 'Every Bonus, Numbers Included',
    pageDescription:
      'Every bonus in one place, each with the casino behind it and the wagering, the cap and the expiry stated wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own terms page before it went on the board.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses to show right now.',
  },
  categories: {
    pageTitle: 'Casinos By Category',
    pageDescription: 'The same three passes behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'ordered by the figures their own pages publish: the wagering, the payout schedule, the withdrawal limits and the licence behind them.',
    noResults: 'Nothing to show here yet.',
  },
  newsletter: {
    title: 'Fortune, by post.',
    subtitle: 'One email a week: what moved in the rankings, and whose terms changed under them.',
    placeholder: 'Get lucky bonus alerts',
    button: 'Subscribe',
    // The two halves of the line beside the TOP STRIP's field. Split so the
    // lead can take the deep lacquer red (5.85:1 on that ground) while the
    // rest stays in the softer ink. The bright brand red is 4.25:1 there and
    // cannot carry it.
    barLead: 'Fortune, by post:',
    barTail: 'new casinos and the week’s ranking moves, every Thursday.',
    // The coral band above the footer — this site's only capture point, so its
    // heading is a real <h2> rather than the form's own label.
    bandTitle: 'A little fortune, once a week.',
    bandSubtitle: 'New reviews, the bonuses worth claiming this week, and every ranking move — one short email, no filler.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent casino reviews and rankings, read from each operator’s own terms and banking pages. We may earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    // Supplied 2026-11-18. Must stay identical to this site's
    // `registered_address` in the admin (Sites -> Edit -> Legal identity),
    // which is what the legal pages and the email templates print: two
    // different addresses for one brand is a compliance problem, not a typo.
    //
    // EMPTY until this site has one. The footer omits the whole <address>
    // element while it is blank, which is correct — printing a sibling's
    // address here would put a false registered identity on a live domain.
    postalAddress: '52 Beechwood Avenue, Ipswich, IP4 5TR, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to say how it went.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether it paid out as written',
    bodyPlaceholder: 'How did it actually go — wagering, cap, verification, withdrawal?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
