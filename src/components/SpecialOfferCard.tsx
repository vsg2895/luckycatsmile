import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid offer cards sit in — the mockup's `.offers`:
 * `minmax(min(100%,300px),1fr)`.
 *
 * `offer-grid` is what drives the three-tone cycle on the slips' spines
 * (globals.css). A CSS `:nth-child` cycle is right HERE and wrong on the bonus
 * types: a spine's colour is rhythm and carries no meaning, so repainting when
 * the set changes costs nothing.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/luckycatsmile.html:
 * a FORTUNE SLIP. A 4px-cornered card with a vertical SPINE down its left
 * edge carrying the operator's name set in `writing-mode: vertical-rl`, like
 * the title on a paper slip stood on end, and the terms printed beside it.
 *
 * It is the one place this design uses a hard offset shadow, and only on
 * hover, where the card also steps up and left so the shadow reads as the slip
 * being lifted off the page rather than as a resting border.
 *
 * The spine's three tones cycle by position — see OFFER_GRID. Red and matcha
 * carry the warm off-white (4.99:1 and 4.87:1); gold carries INK, because
 * light text on #C9962B would be 2.2:1.
 *
 * THE SPINE IS HIDDEN FROM SCREEN READERS where the casino's name is already
 * in the body: rotated text is read in order but announced out of context, and
 * the name is not lost — `kind` names the offer and the title links it.
 *
 * `logo` lets a casino page pass its own logo: the offers it lists arrive
 * without their casino attached. This design prints the NAME rather than the
 * mark, so the logo is used only for the initials fallback.
 */
export default function SpecialOfferCard({ offer, logo: logoOverride }: { offer: SpecialOffer; logo?: string | null }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const casinoName = offer.casino?.name ?? ''
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const spine = casinoName || offer.bonus_category_name || 'Bonus'

  return (
    <article className="offer relative grid grid-cols-[52px_minmax(0,1fr)] overflow-hidden rounded-[4px] sm:grid-cols-[62px_minmax(0,1fr)]">
      <div aria-hidden className="offer-spine flex items-center justify-center px-0 py-4 font-display text-[15px] tracking-[0.06em] sm:text-[17px]">
        <span className="max-h-[260px] overflow-hidden text-ellipsis whitespace-nowrap">{spine}</span>
      </div>

      <div className="flex flex-col gap-2.5 p-[22px]">
        {casinoName && <span className="sr-only">{casinoName}</span>}
        <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
          {offer.bonus_category_name ?? 'Bonus'}
        </span>
        <h3 className="font-display text-[22px] leading-[1.15] text-ink [overflow-wrap:anywhere] sm:text-[25px]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.bonuses || offer.title}
          </Link>
        </h3>
        {/* When the headline above is the AMOUNT, the offer's own name still
            has to appear somewhere — otherwise two different offers of the
            same size are indistinguishable in a grid. */}
        {offer.bonuses && <p className="text-[14px] text-ink-soft [overflow-wrap:anywhere]">{offer.title}</p>}
        <span
          className="text-[14px] leading-none tracking-[2px] text-gold"
          role="img"
          aria-label={`${offer.rating} out of 5`}
        >
          {'★'.repeat(offer.rating)}
          <span className="text-line" aria-hidden>
            {'★'.repeat(5 - offer.rating)}
          </span>
        </span>
        <div className="relative z-10 mt-2 flex w-full gap-2">
          {/*
            * Claim belongs to the Special Offers bonus type and to nothing else.
            *
            *   Special Offers + link   →  See offer · Claim → the casino
            *   Special Offers, NO link →  Claim alone, leading to the offer's own
            *                              page, where the terms and the operator
            *                              are.
            *   any other bonus type    →  See offer alone.
            */}
          {!(claimable && !offer.affiliate_url) && (
            <Link href={`/special-offers/${offer.slug}`} className="btn-ln min-h-[46px] flex-1 px-4 text-[15px]">See offer</Link>
          )}
          {claimable && (
            offer.affiliate_url ? (
              <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-[46px] flex-1 px-4 text-[15px]">Claim</a>
            ) : (
              // No affiliate URL of its own: the offer's page is the only place
              // that can lead to the operator. An internal link, so no sponsored rel.
              <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-[46px] flex-1 px-4 text-[15px]">Claim</Link>
            )
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group card: the logo, whose offer it is, its name
 * and amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and turns pale periwinkle on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate stays WHITE: operator logos arrive with their own white
          ground baked in, and any other fill behind one shows as a hard
          rectangle inside the circle. */}
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-line bg-white p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{kicker}</p>}
        <Heading className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-sm font-bold text-brand-dark [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="text-[13px] font-bold text-brand-dark">Details →</span>
        )}
      </div>
    </li>
  )
}
