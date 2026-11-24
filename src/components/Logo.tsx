import Link from 'next/link'

/**
 * LuckyCatSmile brand mark, from sites/luckycatsmile.html: a lacquer-red seal
 * carrying the beckoning cat — the two eyes, the smile, and the gold coin at
 * its shoulder. A maneki-neko reduced to the four strokes that still read it
 * at 16px.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * The wordmark's second half is RED on the cream header (4.67:1) and GOLD on
 * the ink footer (12.16:1) — the one place this component needs to know which
 * ground it is on, because red on the footer's ink would be 2.4:1.
 *
 * `taglineClassName` lets a caller hide the tagline where the header runs out
 * of room, rather than shipping a second, shorter logo.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 44 44" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="13" fill="#c8321e" />
        <path d="M9 34V13.5c0-1 1.1-1.5 1.8-.9L17 18h10l6.2-5.4c.7-.6 1.8-.1 1.8.9V34a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" fill="#fff6ea" />
        <path d="M14.5 25.5q2.3-2.6 4.6 0M24.9 25.5q2.3-2.6 4.6 0" stroke="#2a1d17" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M17.5 30q4.5 3.6 9 0" stroke="#c8321e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="35.5" cy="9" r="4" fill="#f1dda8" stroke="#c9962b" strokeWidth="1.2" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[21px] sm:text-[23px] ${onDark ? 'text-cream' : 'text-ink'}`}>
          LuckyCat<span className={onDark ? 'text-night-accent' : 'text-brand'}>Smile</span>
        </span>
        <span className={`mt-[5px] text-[11.5px] tracking-[0.06em] ${onDark ? 'text-night-faint' : 'text-muted'} ${taglineClassName}`.trim()}>
          Casinos with good fortune
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
