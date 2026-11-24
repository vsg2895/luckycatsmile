import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * LuckyCatSmile category tabs, from sites/luckycatsmile.html (`.filters` /
 * `.tab`): a wrapping row of cream pills on a hairline, each carrying its
 * casino count in a small disc. The current one fills INK and puts its count
 * on a GOLD disc — the one place in the row where gold appears.
 *
 * The resting border is `line-strong`, not the mockup's `--line`: a tab is a
 * CONTROL, and that hairline is 1.30:1 where a control boundary needs 3:1.
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-6">
      {/* WRAPS rather than scrolling sideways. The mockup's row is
          `flex-wrap`, and with seven categories plus their counts a single
          scrolling line on a phone hides most of the set behind a gesture with
          no affordance saying so. */}
      <ul className="flex flex-wrap gap-2" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="min-w-0">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full px-[18px] text-[14.5px] font-medium ${
                  active ? 'border-ink bg-ink text-cream hover:border-ink' : 'text-ink'
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  <span
                    className={`grid h-[22px] min-w-[22px] place-items-center rounded-full px-1 text-[12px] font-bold tabular-nums ${
                      active ? 'bg-accent text-accent-ink' : 'bg-surface text-ink-soft'
                    }`}
                  >
                    {c.casinos_count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
