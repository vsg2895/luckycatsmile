import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * Exported so the home page's lucky-picks list shows the same stars as a card.
 *
 * The gold is `--color-gold` #A8760F, deeper than the mockup's #C9962B, which
 * is 2.58:1 on a card — a filled star and an empty one would read as the same
 * shape at the same weight. The exact figure is printed beside the stars
 * everywhere they appear, so the colour is never the only carrier.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 15px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-accent' : 'text-gold'
  const off = onDark ? 'text-night-line' : 'text-line'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `.list`: TWO across on a wide
 * screen, one below 900px. Callers render `<ol className={CASINO_LIST}>`; the
 * order of the list is the ranking.
 */
export const CASINO_LIST = 'grid grid-cols-1 gap-[18px] min-[56.25rem]:grid-cols-2'

/**
 * A casino as a CARD — `.cc` in sites/luckycatsmile.html: a cream card on a
 * hairline carrying a gold COIN for the logo, the name and rating, the welcome
 * bonus in a gold-dashed well, the region chips, and the two actions.
 *
 * The leader takes a red border, a soft red halo and the "Top pick" RIBBON
 * hung over its top edge. All three are driven by `rank === 1` rather than
 * `:first-child`, so page 2 of /casinos does not crown its first card.
 *
 * THE RIBBON IS THE ONE PLACE THIS NETWORK PRINTS A RANK, and it prints a
 * word rather than a numeral: "Top pick" says the same thing the `<ol>` order
 * does, where a "1" beside every card would invite reading the list as a
 * score. The rule the siblings follow — no rank numerals on a casino card —
 * holds.
 *
 * The mockup's "Min. deposit" and "Avg. payout time" chips are NOT shipped: no
 * column in the API holds either, and a payout time is the one figure this
 * site has promised not to invent. The chips carry `countries`, which is real.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1

  return (
    <li
      className={`rw relative flex flex-col gap-[18px] rounded-[18px] p-[26px] ${isLeader ? 'rw-top' : ''}`}
    >
      {isLeader && (
        <span className="absolute -top-[13px] left-[26px] rounded-full bg-brand px-3.5 py-[5px] text-[12.5px] font-bold uppercase tracking-[0.08em] text-brand-ink">
          {COPY.casinos.topPick}
        </span>
      )}

      <div className="flex flex-col items-start gap-4 min-[26rem]:flex-row min-[26rem]:items-center">
        {/* The coin — a gold-rimmed disc with a lighter ring inside. A FIXED
            size at every breakpoint, never `auto`: operator artwork ranges
            from square to wide banner, and an auto box sizes itself to
            whichever it happens to get. `object-contain` letterboxes a wide
            banner inside the circle rather than cropping it. */}
        <div className="coin grid h-[78px] w-[78px] flex-none place-items-center overflow-hidden rounded-full p-2 text-center">
          {image ? (
            /* A WHITE DISC inside the gold rim, not the artwork straight on
               the coin. Operator logos arrive with their own white ground
               baked into the file: dropped onto the coin's gradient, half of
               them render as a hard white RECTANGLE inside the circle and
               break the coin. One disc makes every card look the same and is
               how each logo was drawn to be seen. */
            <span className="grid h-[62px] w-[62px] place-items-center overflow-hidden rounded-full bg-white p-1.5">
              <Image src={image} alt={`${casino.name} logo`} width={220} height={220} sizes="62px" className="max-h-[50px] w-full object-contain" />
            </span>
          ) : (
            <span className="font-display text-[13px] leading-[1.05] text-ink [overflow-wrap:anywhere]">{casino.name}</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-[24px] text-ink [overflow-wrap:anywhere] sm:text-[27px]">{casino.name}</h3>
          <p className="mt-1 flex items-center gap-2">
            <Stars rating={casino.rating} />
            <span aria-hidden className="text-sm font-medium text-ink tabular-nums">{casino.rating.toFixed(1)}</span>
          </p>
        </div>
      </div>

      {/* The welcome bonus in the mockup's gold-dashed well. Dropped entirely
          when the operator has none, rather than left as an empty box. */}
      {casino.bonuses && (
        <div className="rounded-xl border border-dashed border-accent bg-cream px-[18px] py-4">
          <small className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-matcha">Welcome bonus</small>
          <b className="font-display text-[19px] font-normal leading-[1.25] text-ink [overflow-wrap:anywhere] sm:text-[21px]">{casino.bonuses}</b>
        </div>
      )}

      {shownRegions.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Accepts players from">
          {shownRegions.map((country) => (
            <li key={country.id} className="rounded-full bg-surface px-[11px] py-1 text-[12.5px] font-medium text-ink-soft">
              {country.name}
            </li>
          ))}
          {extraRegions > 0 && (
            /* A count, not a tooltip: the full list is on the review page, and
               a hover affordance is invisible on a phone. */
            <li className="rounded-full bg-win-bg px-[11px] py-1 text-[12.5px] font-medium text-win">+{extraRegions} more</li>
          )}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-2.5 min-[26rem]:flex-row min-[26rem]:items-center">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[46px] flex-1 px-5 text-[15px]"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="btn-ln min-h-[46px] flex-1 px-5 text-[15px]">
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}
