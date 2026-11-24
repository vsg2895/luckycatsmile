import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses — the mockup's `.subh` + `.offers` pairs: one SERIF
 * subhead per bonus type, trailed by a rule that runs to the right edge, over
 * a grid of that type's fortune slips.
 *
 * Built in this site's own language rather than the sibling sites' — which is
 * the point, since they all serve the same catalogue and a reader comparing
 * them should not meet the same block four times. The siblings wrap each type
 * in a card with a coloured head; here the type is a quiet serif line and the
 * SLIPS carry the colour, which is the arrangement the mockup draws and the
 * reason its spines cycle three tones.
 *
 * The trailing rule is a flex child rather than a border, so it fills whatever
 * the heading leaves rather than needing a width nobody can know.
 *
 * Each subhead carries the type's name, this site's own `offers_count` for it,
 * and a link to the type's page. The count is resolved server-side over the
 * unlimited set, so it is the number of offers of this kind on the whole site
 * rather than the number of cards under it.
 *
 * Every type's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the bonus-type cards land on.
 *
 * Each grid is its own `offer-grid`, so the three-tone cycle RESTARTS per
 * type: the colours are rhythm within a run of cards, and a cycle carried
 * across group boundaries would make the first slip of each group a different
 * colour for no reason a reader could name.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-11">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-24"
        >
          <div className="mb-4 flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <h3 id={`bonus-${section.slug}-heading`} className="min-w-0 font-display text-[20px] text-ink sm:text-[22px]">
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only">
                {' '}— {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
            </h3>
            <span aria-hidden className="text-[13px] text-muted tabular-nums">{section.offers_count}</span>
            <span aria-hidden className="h-px min-w-6 flex-1 bg-line" />
            <Link
              href={`/bonuses/${section.slug}`}
              className="-my-3 inline-flex min-h-11 items-center py-3 text-[15px] font-bold text-brand transition-colors hover:text-brand-dark"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="mb-4 max-w-[640px] text-sm text-ink-soft">{section.description}</p>}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
