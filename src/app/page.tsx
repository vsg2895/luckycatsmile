import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the mockup's opening: the page cream itself, the claim at the
            left with one phrase under a gold HIGHLIGHT, the "lucky picks" slip
            riding beside it, and a band of SEIGAIHA closing the whole thing.

            No slab and no coloured band: this design separates sections with
            the wave and with whitespace, never with a second ground. `.slab`
            keeps its name so the page component did not have to change. */}
        <section className="slab relative overflow-hidden pb-[110px] pt-12 sm:pt-[76px]">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
            <div className="grid grid-cols-1 items-center gap-11 min-[56.25rem]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] min-[56.25rem]:gap-14">
              <div>
                {/* MATCHA, because this label is the one claim on the page
                    that something is current, and matcha is this site's colour
                    for a fact. The disc carries a star at 4.87:1. */}
                <p className="flex items-center gap-2.5 text-[14px] font-bold tracking-[0.04em] text-matcha">
                  <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-matcha text-[14px] text-cream">★</span>
                  {COPY.home.heroEyebrow}
                </p>
                <h1 className="mt-5 font-display text-[clamp(40px,6.6vw,80px)] text-pretty text-ink">
                  {COPY.home.heroHeadline}{' '}
                  {/* The gold HIGHLIGHT, drawn as the phrase's own background
                      rather than the mockup's negative-z pseudo-element — see
                      `.hl` in globals.css for why. */}
                  <em className="hl not-italic text-brand">{COPY.home.heroHighlight}</em>
                  {COPY.home.heroHeadlineTail && <> {COPY.home.heroHeadlineTail}</>}
                </h1>
                <p className="mt-6 max-w-[540px] text-[17px] text-ink-soft sm:text-[19px]">{COPY.home.heroSubtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/casinos" className="btn-or btn-gold min-h-[52px] px-7 text-[15.5px]">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="btn-ln btn-on-dark min-h-[52px] px-7 text-[15.5px]">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
              </div>

              {/* The slip — the mockup's `.slip`: an ink-bordered card whose
                  head is RED under the wave, then the top three as rows, then
                  one button across the foot.

                  The mockup's rows print a MIN. DEPOSIT and a PAYOUT TIME per
                  casino. Neither ships: no column in the API holds either, and
                  a payout time is the one figure this site has promised not to
                  invent. The rating goes there instead, which is real. */}
              {casinos.length >= 3 && (
                <aside className="hard-gold overflow-hidden rounded-[24px]" aria-labelledby="podium-heading">
                  <div className="relative bg-brand px-[26px] pb-[30px] pt-[26px] text-brand-ink">
                    <div aria-hidden className="wave absolute inset-0 opacity-90 [--w1:rgba(255,246,234,0.12)]" />
                    <div className="relative">
                      <span className="live inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.08em] text-accent-ink [&::before]:bg-matcha">
                        {COPY.home.podiumBadge}
                      </span>
                      <h2 id="podium-heading" className="mt-3.5 font-display text-[clamp(24px,3vw,32px)]">
                        {COPY.home.podiumTitle}
                      </h2>
                      <p className="mt-1.5 text-[14.5px] text-[#ffe3d6]">{COPY.home.podiumSubtitle}</p>
                    </div>
                  </div>

                  <ol className="px-3.5 pb-1.5 pt-2.5">
                    {casinos.slice(0, 3).map((c, i) => (
                      <li key={c.id}>
                        <Link href={`/casinos/${c.slug}`} className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl p-3 text-ink transition-colors hover:bg-cream sm:grid-cols-[48px_minmax(0,1fr)_auto]">
                          {/* The mockup's `.t3n`: a struck gold coin. The
                              numeral stays HERE — the network prints no rank
                              on a casino CARD, but this list is three long and
                              titled as picks, so the position is the content. */}
                          <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#a97a18] bg-[radial-gradient(circle_at_35%_30%,#fbe9b8,var(--color-accent)_70%)] font-display text-[18px] text-ink shadow-[inset_0_0_0_3px_rgba(255,255,255,0.35)] sm:h-12 sm:w-12 sm:text-[19px]">
                            {i + 1}
                          </span>
                          <span className="min-w-0">
                            {/* WRAPS rather than truncating: at 320px this
                                column has about 150px, and a list of top picks
                                whose names are cut off identifies nothing. */}
                            <span className="block font-display text-[18px] text-ink [overflow-wrap:anywhere] sm:text-[19px]">{c.name}</span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                              <Stars rating={c.rating} />
                              <span className="tabular-nums">{c.rating.toFixed(1)}</span>
                            </span>
                          </span>
                          <span aria-hidden className="grid h-[38px] w-[38px] place-items-center rounded-full border-[1.5px] border-line text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-ink">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>

                  <div className="px-[26px] pb-6 pt-2">
                    <Link href="/casinos" className="btn-ln min-h-[46px] w-full px-5 text-[15px]">
                      {COPY.home.podiumAll}
                    </Link>
                  </div>
                </aside>
              )}
            </div>
          </div>

          {/* The wave that closes the hero. Decorative, so `aria-hidden`. */}
          <div aria-hidden className="wave pointer-events-none absolute inset-x-0 bottom-0 h-[60px]" />
        </section>

        {/* 1 — the rankings. Category tabs, then the casinos as cards. */}
        <section className="pt-16 sm:pt-[90px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
            <SectionHead
              no="1"
              id="top-casinos-heading"
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              <p className="rounded-[18px] border-[1.5px] border-dashed border-line-strong p-11 text-center text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-7 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-12 px-[22px] text-[15px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 2 — the bonus types, as arched cards. Nothing at all without a
            Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pt-16 sm:pt-[90px]" aria-labelledby="bonus-types-heading">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
              <SectionHead no="2" id="bonus-types-heading" title={COPY.home.bonusTypesTitle} />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 3 — the offers, as fortune slips under a serif subhead per type. */}
        {bonusSections.length > 0 ? (
          <section className="pt-16 sm:pt-[90px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
              <SectionHead
                no="3"
                id="bonus-heading"
                title={COPY.home.bonus}
                subtitle={COPY.home.bonusesSubtitle}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pt-16 sm:pt-[90px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
              <SectionHead
                no="3"
                id="offers-heading"
                title={COPY.home.specialOffers}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' special offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4 — how a casino earns its place. Not in the mockup, which ends at
            the FAQ; kept because it is the page's only account of where the
            ranking comes from, and an affiliate site that ranks operators
            without publishing its method is asking to be taken on trust. */}
        <section className="pt-16 sm:pt-[90px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
            <SectionHead no="4" id="method-heading" title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step rounded-[18px] p-[26px]">
                  <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.08em] text-matcha">
                    <span aria-hidden className="grid h-[42px] w-[42px] place-items-center rounded-full border-[1.5px] border-brand font-display text-[18px] text-brand">{step.no.replace(/^0/, '')}</span>
                    {step.verb}
                  </p>
                  <h3 className="mt-4 font-display text-[21px] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-center gap-3 text-sm font-medium text-muted">
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 5 — the FAQ, two across as the mockup lays it out. Every answer is
            in the HTML, open or closed, which the FAQPage schema requires. */}
        <section className="pt-16 sm:pt-[90px]" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-[22px]">
            <SectionHead no="5" id="faq-heading" title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} />
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: a serif numeral in a red ring, the heading and its
 * line beside it, and an optional link to the full list pushed to the right.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own. Nothing
 * else renders it, so it lives where it is used.
 */
function SectionHead({
  no,
  id,
  title,
  subtitle,
  more,
}: {
  no: string
  id: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
}) {
  return (
    /* A GRID, so the numeral owns a track of its own and EVERYTHING else —
       the heading, its line, and the "view all" link — lives in the second
       one. That is what keeps the link aligned with the heading when the row
       is too narrow to hold both: as a flex sibling of the numeral it wrapped
       to the CONTAINER's left edge instead, 58px out of line with the title it
       belongs to, which on a phone reads as a mistake rather than a wrap.
       Column two does the aligning, so there is no magic indent to keep in
       step with the numeral's size. */
    <div className="mb-7 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 sm:mb-[30px] sm:gap-x-[18px]">
      <span aria-hidden className="mt-1 grid h-[42px] w-[42px] flex-none place-items-center rounded-full border-[1.5px] border-brand font-display text-[18px] text-brand sm:h-[50px] sm:w-[50px] sm:text-[22px]">
        {no}
      </span>
      <div className="flex min-w-0 flex-wrap items-end justify-between gap-x-5 gap-y-3">
        <div className="min-w-0">
          <h2 id={id} className="font-display text-[30px] text-ink sm:text-[clamp(32px,4.4vw,52px)]">
            {title}
          </h2>
          {subtitle && <p className="mt-2 max-w-[620px] text-[16.5px] text-ink-soft">{subtitle}</p>}
        </div>
        {more && (
          <Link href={more.href} className="inline-flex min-h-11 items-center text-[15px] font-bold text-brand transition-colors hover:text-brand-dark">
            {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden className="ml-1">→</span>
          </Link>
        )}
      </div>
    </div>
  )
}
