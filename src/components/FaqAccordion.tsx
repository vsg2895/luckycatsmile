type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/luckycatsmile.html (`.faq` / `.fq`): cream cards
 * on a hairline, TWO ACROSS on a wide screen, each opening on a numbered serif
 * key at its left and a disc at its right that rotates 45° into a cross and
 * fills RED. The first is open.
 *
 * `self-start` on each card is load-bearing: grid cells stretch to the tallest
 * in their row by default, so opening one card would otherwise stretch its
 * neighbour's box to match and leave a block of empty cream under its
 * question.
 *
 * The NUMBERS are part of the design and are generated here rather than stored
 * in the FAQ constant — they are a position in a list, and a question moved in
 * that file must not carry a stale "03" with it.
 *
 * The mark is drawn from two pseudo-elements rather than a "+" character.
 * A glyph's cross-bar sits off-centre in most faces, which is invisible until
 * it rotates 45° and the × comes out lopsided. The rotation and the fill are
 * `.pm` in globals.css, driven by `details[open]`.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only this mark shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid grid-cols-1 items-start gap-3.5 min-[56.25rem]:grid-cols-2">
      {items.map((item, i) => (
        <details
          key={item.question}
          open={i === 0}
          className="group self-start rounded-[18px] border-[1.5px] border-line bg-paper transition-colors open:border-ink"
        >
          <summary className="flex cursor-pointer list-none items-center gap-4 px-[22px] py-5 [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="w-[30px] flex-none font-display text-[18px] text-brand">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="flex-1 font-display text-[18px] leading-[1.25] text-ink [overflow-wrap:anywhere] sm:text-[19px]">{item.question}</h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span
              aria-hidden
              className="pm relative grid h-8 w-8 flex-none place-items-center rounded-full text-ink
                before:absolute before:h-[2px] before:w-3.5 before:rounded-sm before:bg-current before:content-['']
                after:absolute after:h-[2px] after:w-3.5 after:rotate-90 after:rounded-sm after:bg-current after:content-['']"
            />
          </summary>
          {/* Indented to the question's left edge on a wide screen, flush on a
              phone — the mockup's own `.fq p{padding-left:68px}` with its
              640px override, where 68px of indent on a 320px column would
              leave the answer in a gutter. */}
          <p className="px-[22px] pb-[22px] text-[16px] leading-[1.7] text-ink-soft sm:pl-[68px]">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
