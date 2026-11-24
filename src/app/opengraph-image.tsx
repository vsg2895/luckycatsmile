import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // The page's own cream under a wash of the lacquer red the header
          // strip and the footer wave both use. The seigaiha itself is not
          // drawn here: at card size its 40x20 tile aliases into a moiré.
          background: '#f6efe3',
          backgroundImage:
            'radial-gradient(60% 70% at 50% 115%, rgba(200,50,30,0.16), rgba(200,50,30,0) 70%)',
          color: '#2a1d17',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            background: '#56703a',
            color: '#fff6ea',
            borderRadius: 999,
            padding: '12px 32px',
            fontFamily: 'sans-serif',
          }}
        >
          Read, Not Guessed
        </div>
        {/* Satori needs an EXPLICIT display on any element with more than one
            child — the wordmark is two coloured spans, so this one says flex
            rather than relying on the browser default it never sees. */}
        <div
          style={{
            display: 'flex',
            fontSize: 100,
            marginTop: 26,
            padding: '0 60px',
          }}
        >
          {/* One word in two colours, so the two spans must touch exactly.
              Red is 4.67:1 on this cream, so it carries text here without a
              deeper variant. */}
          <span>LuckyCat</span><span style={{ color: '#c8321e' }}>Smile</span>
        </div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 30, color: '#75624f', fontFamily: 'sans-serif' }}>
          18+ · Gamble responsibly
        </div>
      </div>
    ),
    size,
  )
}
