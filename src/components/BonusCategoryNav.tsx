import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Browse by bonus type", from sites/luckycatsmile.html (`.btypes` /
 * `.btype`): a grid of cards each capped by a full 999px ARCH over square
 * feet — a torii, or a fortune-slip drawer — with the type's icon in a disc
 * that fills RED on hover, the name under it and its offer count beneath.
 *
 * Six across on a wide screen, three on a tablet, two on a phone: the
 * mockup's own ladder. A GRID rather than a wrapping flex row, because these
 * cards are centred and the arch has to be the same width on every one of
 * them — an uneven last row would break the arcade the row makes across the
 * band.
 *
 * There is no per-type COLOUR on this site. The siblings tint each type's
 * plate; here a type is marked by its place in the arcade, and the one fill is
 * the red a disc takes when you point at it.
 *
 * This component renders NO HEADING. The section's head — its numeral, title
 * and "view all" — is drawn by the page's own `SectionHead`, and a second
 * <h2> carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each card opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <ul className="grid grid-cols-2 gap-3.5 min-[46rem]:grid-cols-3 min-[67.5rem]:grid-cols-6" role="list">
      {types.map((section) => (
        <li key={section.id} className="min-w-0">
          <Link
            href={`/bonuses/${section.slug}`}
            className="btype flex h-full flex-col items-center gap-3.5 px-3 pb-[22px] pt-[26px] text-center text-ink"
          >
            <span aria-hidden className="btype-plate grid h-[66px] w-[66px] shrink-0 place-items-center rounded-full">
              {/* The type's own icon, as in the Bonus menu. A plain <img>:
                  next/image refuses SVG. alt="" because the label names it. */}
              {section.icon_path && (
                <img src={resolveImageUrl(section.icon_path)!} alt="" width={30} height={30} className="h-[30px] w-[30px]" />
              )}
            </span>
            <b className="min-w-0 font-display text-[17px] font-normal leading-[1.15] [overflow-wrap:anywhere] sm:text-[18px]">
              {section.name}
            </b>
            <span className="text-[13px] text-muted">
              {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
