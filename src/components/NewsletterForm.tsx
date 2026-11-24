'use client'

import { useState } from 'react'
import { COPY } from '@/constants/copy'
import { useToast } from '@/components/ToastProvider'
import { isValidEmail } from '@/lib/email'

/**
 * `compact` means NO INTRO — the field and the button alone, without the title
 * and subtitle the component otherwise prints above them.
 *
 * Both of this site's capture points are compact: the band above the footer
 * already carries an <h2> and its line, and the header has room for a field
 * and nothing else. Letting the form print its own pair on the band would
 * publish both twice, once as a heading and once as a paragraph. The
 * accessible name still carries the copy either way (`aria-label` on the form).
 *
 * It does NOT mean "small": every mode is 48px, over the 44px tap target.
 *
 * `tone` is which GROUND the form is standing on, and it exists because this
 * site has two:
 *
 *   'band' — the deeper-cream block above the footer. Field and button are two
 *            separate shapes, the field on the white card colour.
 *   'bar'  — the SUBSCRIBE STRIP above the header. Both sit inside ONE
 *            ink-outlined pill, which is the mockup's `.hsub`, and the border
 *            lights red on focus.
 *
 * A boolean would have been enough today and wrong tomorrow: the next ground
 * this form lands on gets its own name here rather than a second flag.
 */
export default function NewsletterForm({
  compact = false,
  tone = 'band',
  className = '',
}: {
  compact?: boolean
  tone?: 'band' | 'bar'
  className?: string
}) {
  const onBar = tone === 'bar'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [website, setWebsite] = useState('')
  // A domain-typo correction from SendGrid, e.g. user@gmial.com -> gmail.com.
  // The ONLY validation detail ever shown to a visitor: it is about their own
  // address, and it turns a dead form into a corrected signup.
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null)
  const toast = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error')
      return
    }
    setLoading(true)
    setSuggestedEmail(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      if (!res.ok) {
        // Surface backend validation (e.g. 422 "You are already subscribed.").
        const data = (await res.json().catch(() => ({}))) as {
          message?: string
          errors?: { email?: string[] }
          suggested_email?: string | null
        }

        setSuggestedEmail(data.suggested_email ?? null)
        toast(data.errors?.email?.[0] ?? data.message ?? COPY.newsletter.error, 'error')
        return
      }
      // The API reports whether a verification email is actually going out
      // (`email_sent` mirrors the site's newsletter_emails_enabled switch).
      // Telling someone to watch their inbox — and dig through spam — for mail
      // this site is not sending would be a worse failure than not collecting
      // the address at all.
      const { email_sent: emailSent } = (await res.json().catch(() => ({}))) as { email_sent?: boolean }

      // Keep the form in place; confirm via a top-corner toast.
      toast(emailSent === false ? COPY.newsletter.successNoEmail : COPY.newsletter.success, 'success')
      setEmail('')
    } catch {
      toast(COPY.newsletter.error, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? `min-w-0 ${className}`.trim() : `flex flex-wrap items-center justify-between gap-4 ${className}`.trim()}>
      {/* The strip's introduction. The compact form drops it: see above. */}
      {!compact && (
        <div className="min-w-0 flex-[1_1_360px]">
          <p className="font-display text-[19px] leading-tight text-ink">{COPY.newsletter.title}</p>
          {/* 14px on a phone, 13px from `sm` up. The line that explains what
            you get has to clear the project's 14px phone readability floor —
            which the globals.css rule only raises for `.text-xs`, not for a
            literal size. */}
        <p className="mt-0.5 text-sm text-ink-soft sm:text-[13px]">{COPY.newsletter.subtitle}</p>
        </div>
      )}

      <div className={compact ? 'w-full min-w-0' : 'w-full min-w-0 flex-[0_1_420px]'}>
        {/* Field and button share one row at every width, as in the mockup;
            `min-w-0` lets the field give way so the button never wraps. */}
        <form
          onSubmit={onSubmit}
          // The bar mode draws ONE pill around both controls — the mockup's
          // `.hsub` — and lights its border red while anything inside has
          // focus. The band mode keeps them as two separate shapes.
          className={
            onBar
              ? 'relative flex gap-1.5 rounded-full border-[1.5px] border-ink bg-paper p-[5px] focus-within:border-brand'
              : 'relative flex flex-col gap-2.5 sm:flex-row'
          }
          aria-label={`${COPY.newsletter.title} ${COPY.newsletter.subtitle}`}
        >

          {/* HONEYPOT. Never shown, never focusable, never autofilled — a human
              cannot reach it, a naive bot fills every field it finds. The server
              rejects any request that carries a value, before the site is
              touched and long before a paid validation credit could be spent.
              Positioned off-screen rather than display:none, which some bots
              skip. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            // Hidden by an INLINE STYLE, deliberately not by a Tailwind class.
            // The class was a real bug: utility CSS can load late, fail, or be
            // purged, and for as long as it is missing this renders as an
            // ordinary focusable text input sitting in the middle of the
            // subscribe form. A person who types into it gets their signup
            // rejected as a bot — an anti-bot measure silently turning away the
            // humans it exists to protect. An inline style travels inside the
            // HTML, so it cannot desync from the markup that carries it.
            //
            // Still off-screen rather than display:none or the hidden
            // attribute: a honeypot only works while a bot believes the field
            // is real, and the obvious ways of hiding it are the ways a bot
            // checks for. pointer-events:none means that even a rendering
            // accident cannot let a human click into it.
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={COPY.newsletter.placeholder}
            aria-label={COPY.newsletter.placeholder}
            autoComplete="email"
            // 44px in the bar, 48px in the band. `compact` means "no intro",
            // not "small": the sibling sites shrink the field to 42px for a
            // header pill, and 42px is under the 44px tap target.
            //
            // The bar's pair WAS 40px, which was survivable only while the
            // strip showed from 1280px up and nothing but a mouse ever
            // reached it. It is now on every width including phones, so both
            // controls are a real 44px row; with the pill's 5px padding and
            // 1.5px edge that makes the strip 57px, in line with the siblings.
            // `flex-1` IS BREAKPOINT-PREFIXED, and that is load-bearing.
            // The band form is `flex-col` on a phone and only becomes a row
            // further up. `flex-1` is `flex: 1 1 0%`, and flex-basis applies
            // to the MAIN axis — so in column mode it zeroed the field's
            // HEIGHT, and the `h-12` beside it lost: the subscribe field
            // shipped 22.5px tall on a phone, half its size and half the tap
            // target. In row mode it is still needed, or `w-full` takes the
            // whole line and pushes the key out. So it applies only from the
            // width the form actually becomes a row.
            className={
              onBar
                ? 'h-11 w-full min-w-0 flex-1 border-0 bg-transparent px-4 text-[14.5px] text-ink placeholder:text-muted focus:outline-none'
                : 'h-12 w-full min-w-0 sm:flex-1 rounded-full border-[1.5px] border-line-strong bg-paper px-5 text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none'
            }
          />
          <button
            type="submit"
            disabled={loading}
            // The lacquer key in both tones; only its height changes. The
            // mockup's header button is the same red pill as the band's.
            className={
              onBar
                ? 'btn-or h-11 shrink-0 whitespace-nowrap px-4 text-sm focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-60 min-[27.5rem]:px-[18px]'
                : 'btn-or h-12 shrink-0 whitespace-nowrap px-6 text-[15px] focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-60'
            }
          >
            {loading ? COPY.newsletter.checking : COPY.newsletter.button}
          </button>
        </form>

        {/* One click swaps the address in and resubmits. The corrected address
            is a DIFFERENT cache key upstream, so it gets its own validation
            call rather than reusing the typo's verdict. */}
        {suggestedEmail && (
          <p className="mt-2 text-sm">
            Did you mean{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestedEmail); setSuggestedEmail(null) }}
              className="font-semibold underline underline-offset-2"
            >
              {suggestedEmail}
            </button>
            ?
          </p>
        )}
      </div>
    </div>
  )
}
