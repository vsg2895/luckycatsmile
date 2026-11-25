import type { Metadata, Viewport } from 'next'
import { Young_Serif, Zen_Kaku_Gothic_New } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The two faces of sites/luckycatsmile.html.
//
// Young Serif ships exactly ONE weight, 400, and that is why it is here: the
// mockup sets every heading to it, and a synthetic bold would thicken its slab
// serifs into mud. `.font-display` pins it, so no caller can ask for a weight
// the family does not have.
//
// Zen Kaku Gothic New carries everything read as text. 900 is loaded but
// unused — 700 is the heaviest the design goes, on buttons and eyebrow labels.
const youngSerif = Young_Serif({ variable: '--font-young-serif', subsets: ['latin'], weight: ['400'] })
/*
 * `preload: false` IS LOAD-BEARING, and it is the reason this site stopped
 * answering 502 in production on 2026-11-25.
 *
 * Zen Kaku Gothic New is a JAPANESE family. Even asked for `subsets: ['latin']`
 * Google serves it sliced into dozens of `unicode-range` files, and `next/font`
 * emits a `rel=preload` for every one of them — in the RESPONSE HEADER, not the
 * HTML. Measured on `GET /`: 48 preload entries, a `Link` header of 5,909 bytes
 * and 6,314 bytes of headers in total.
 *
 * nginx's default `proxy_buffer_size` is 4,096 bytes. Anything larger and it
 * refuses the response with
 *
 *     upstream sent too big header while reading response header from upstream
 *
 * and returns 502 — with the app perfectly healthy behind it, which is what
 * made it slow to find. Cloudflare then shows its own "Bad gateway" page and
 * the whole thing looks like a hosting problem.
 *
 * With this flag the same request carries 2 preload entries and 622 bytes of
 * headers: ten times smaller, and far inside the buffer. The cost is that the
 * body face is no longer preloaded, so it arrives one round trip later; with
 * next/font's default `display: swap` that is a brief fallback flash, which is
 * the right trade against a page that does not load at all. 46 of those 48
 * preloads were for glyph ranges an English-only site never renders.
 *
 * The buffer is ALSO raised in deploy/nginx-canonical-host.conf, because the
 * proxy should not be one font away from failing on any site. Both layers, on
 * purpose: this one keeps the header small, that one keeps a large header from
 * being fatal.
 */
const zen = Zen_Kaku_Gothic_New({
  variable: '--font-zen',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  preload: false,
})

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'LuckyCatSmile'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6efe3',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A header link — the mockup's `.hdr .nav a`: a pill that takes the deeper
 *  cream and turns RED on hover. */
const NAV_LINK = 'flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium text-ink transition-colors hover:bg-surface hover:text-brand-dark'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-[14.5px] text-night-ink transition-colors hover:text-night-accent'

/** A footer column head — the mockup's `.ftr h4`: the serif, in the page cream. */
const FOOTER_HEAD = 'font-display text-[18px] text-cream'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette. */
const NAV_PANEL = {
  panelClassName: 'bg-paper ring-1 ring-line shadow-[0_18px_40px_-18px_rgba(42,29,23,0.25)]',
  itemClassName: 'text-ink-soft hover:bg-surface hover:text-brand-dark',
  allItemClassName: 'text-ink hover:bg-surface hover:text-brand-dark',
  arrowClassName: 'text-brand',
}

/** The phone menu (below `lg`), in this site's own palette. The trigger takes
 *  `line-strong` rather than `line`: it is a CONTROL, and the mockup's
 *  hairline is 1.30:1 where a control boundary needs 3:1. */
const NAV_MOBILE = {
  triggerClassName: 'border-[1.5px] border-ink text-ink hover:bg-surface hover:text-ink',
  panelClassName: 'bg-paper border-line',
  rowClassName: 'text-ink hover:bg-surface hover:text-ink',
  rowExpandedClassName: 'bg-surface text-ink',
  allClassName: 'text-ink hover:bg-surface hover:text-ink',
  childClassName: 'text-ink-soft hover:bg-surface hover:text-ink',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${zen.variable} ${youngSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* The 6px lacquer strip that opens the page — the mockup's `.strip`.
            Purely decorative, and the one piece of chrome above the header. */}
        <div aria-hidden className="h-1.5 bg-brand" />

        {/* THE SUBSCRIBE STRIP, and this site's primary capture point.

            It used to live on the header's own row, from `xl` only, which
            meant a laptop at 1180px and every phone had NO way to subscribe
            above the fold — the band over the footer was the only one, and it
            is eleven screens down. The form is now its own row, present at
            every width, which is what the four sibling sites of this run do.

            OUTSIDE the sticky <header>, deliberately. Inside it the strip
            would stick to the top of every screen forever and cost ~57px of
            every phone viewport on top of the header's own ~70px. Out here it
            scrolls away after it has been seen once, which is all a subscribe
            row needs to do.

            The deeper cream rather than the page cream: the header below is
            cream at 95% and the two would read as one block. The lead
            sentence drops below `md`, as on the siblings — it is the first
            thing that can go when the row narrows, and the field it explains
            carries its own label. */}
        {SUBSCRIBE_ENABLED && (
          <div className="border-b border-line bg-surface">
            <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-2.5 sm:px-[22px]">
              <p className="hidden min-w-0 flex-1 text-[15px] text-ink-soft md:block">
                <b className="font-bold text-brand-dark">{COPY.newsletter.barLead}</b>{' '}
                {COPY.newsletter.barTail}
              </p>
              {/* `compact` = no intro: the sentence beside it is the intro. */}
              <NewsletterForm compact tone="bar" className="w-full md:w-auto md:flex-[0_1_380px]" />
            </div>
          </div>
        )}

        {/* Header — the mockup's `.hdr`: the page cream at 94% behind a blur,
            closed by one hairline, with the seal and wordmark at its left, the
            nav in the middle and the subscribe field at its right.

            NO FORM ON THIS ROW. The mockup puts one here, and it was here
            from `xl` only — below that the row holds a 44px seal, a two-line
            wordmark, four links and a menu button already, and a 360px form
            pushed into it either squeezed the nav or wrapped the header onto
            two lines. So it shipped hidden on every laptop and every phone,
            which left those widths with no subscribe path above the fold at
            all. It now has a row of its own directly above this one, where it
            fits at every width. */}
        <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-5 px-4 py-3 sm:px-[22px] sm:py-4">
            <Logo taglineClassName="hidden sm:block" />
            <nav aria-label="Main navigation" className="hidden lg:block">
              {/* The nav's own white pill — the mockup's `.hdr .nav`. */}
              <ul className="flex items-center gap-0.5" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href}>
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* Below lg the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              hideFrom="lg"
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Subscribe. The mockup has no band of its own — its only capture
            point is the header field, which below `xl` disappears into the
            burger menu. That would leave a phone with no way to subscribe at
            all, so this site keeps a band: the deeper cream, closed top and
            bottom by hairlines, directly above the footer.

            Quiet on purpose. The footer below it opens with a red seigaiha
            band and the page opens with a red strip; a third red block here
            would leave the page ending on two loud bands in a row. */}
        {SUBSCRIBE_ENABLED && (
          <section className="mt-24 border-y border-line bg-surface" aria-label="Newsletter">
            <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-7 px-4 py-12 sm:px-[22px]">
              <div className="min-w-[260px] flex-[1_1_340px]">
                <h2 className="font-display text-[clamp(26px,3.4vw,38px)] text-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="mt-2 text-[16px] text-ink-soft">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` = no intro: the band carries the heading itself. */}
              <NewsletterForm compact className="min-w-[260px] flex-[1_1_380px] lg:max-w-[440px]" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's `.ftr`: the INK ground, opened by a band of
            seigaiha drawn in gold, carrying the brand and its line, Explore /
            Legal / Policies, and the legal bar.

            The wave sits on top rather than at the bottom: it is what the
            cream page breaks into, so the footer reads as the far shore. */}
        <footer className="deep-panel relative text-night-ink">
          <div aria-hidden className="wave absolute inset-x-0 top-0 h-10 [--w1:rgba(201,150,43,0.22)]" />
          <div className="relative mx-auto max-w-[1180px] px-4 pb-7 pt-[86px] sm:px-[22px]">
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_260px]">
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="mt-4 text-[14.5px] text-night-ink">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-2.5`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-2.5 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ mark and the legal line, on one rule — the mockup's
                `.legal`. Not `aria-hidden`: the sentence beside it never says
                the age, so a screen reader needs the "18+" too.

                A RING in a light coral rather than a filled disc: at 5.96:1 on
                the ink it carries its own numerals, and nothing else in this
                footer is a solid fill. */}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-[22px] text-[13.5px] text-night-ink">
              <p className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border-2 border-[#f07a63] text-[12px] font-bold text-[#f07a63]">18+</span>
                <span>
                  <b className="text-cream">Gamble responsibly.</b> {COPY.footer.disclaimer}
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 text-[13.5px] text-night-faint">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
