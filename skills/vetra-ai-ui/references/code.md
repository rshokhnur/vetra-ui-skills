# AI components in code

Read when you implement an AI screen in code. The checklist in `SKILL.md` checks every item here.

- **Motion.** Blink the Streaming Caret at 1Hz, 50% duty. Shimmer the live Reasoning label and spin
  the Working and Running loader glyphs. Blink by animating `background-color` (or `visibility`),
  never `opacity`: `vetra-code` bans opacity on paints, and a faded token is a color the kit
  doesn't have.
  ```css
  @keyframes caret-blink { 50% { background-color: transparent } }
  .caret { background-color: var(--accent-default); animation: caret-blink 1s steps(1) infinite }
  @media (prefers-reduced-motion: reduce) { .caret, .shimmer, .spin { animation: none } }
  ```
  Under `prefers-reduced-motion` the caret stays visible and solid (its file description says so;
  a hidden caret loses where the text ends), the shimmer and the spinners stop, and the label paints
  plain `accent/text`. Turn the shimmer's gradient off with its animation: a clipped-text shimmer
  left without it paints the label transparent.
- **Streaming text** flows inline, the caret right after the last word. Figma's one-line streaming
  line is a Figma limit; don't reproduce it.
- **Announce** through one visually hidden `role="status" aria-live="polite" aria-atomic="true"`
  region on the screen, outside the transcript and outside every streaming text. Feed it a whole
  message once each: a finished reply, an approval request ("Approval needed. Deploy checkout-api
  2.14.1 to production"), a receipt ("Allowed. Deploy checkout-api…"). Queue them about 1s apart.
  Why: a live region around the streaming text speaks every token, and two messages written in
  one tick (a reply ends, a Confirmation appears) leave only the second. The streaming bubble sets
  `aria-busy="true"` until it ends.
- **Disclosures** (Reasoning, Chat Tool Call, Sources) are buttons with `aria-expanded`. A Citation is
  a link with the source's name as its label, and its Citation Card opens on hover and on focus, 8
  below it, with no arrow.
- **Stop.** While Sending, the send button is Stop (`square`) with the label "Stop generating", and
  it works: it settles every part as **Run phases** says and returns focus to the textarea.
- **Confirmation focus.** Tab reaches Deny, then Allow; Enter or Space presses them. On Allow or
  Deny, render the receipt with `tabindex="-1"` and call `focus()` on it, with the accessible name
  "Allowed 10:58 AM, Deploy checkout-api 2.14.1 to production". The next Tab goes on to the
  Composer. Why: the buttons unmount, focus falls to `<body>`, and a keyboard or screen-reader user
  starts over from the top. A Deny sent by typing in the Composer leaves focus in the Composer.
- **Composer keys.** Enter sends, Shift+Enter breaks the line, and Enter during IME composition
  (`isComposing`) does neither. Enter sends nothing while Sending; Stop first. The textarea grows
  with every line: the file sets no height cap and says the box does not scroll, so give it no
  `max-height` and no inner scrollbar; the transcript above gives up the height.
- **Keyboard hints.** A key shown in an AI part is the Kbd (`vetra-components`), one size per
  surface: in code a `<kbd>` with the chord spelled out for screen readers ("Command Enter"). The
  Questionnaire's choice key ships as a Badge (`Key`) in the file; leave it in Figma and render a
  Tiny Kbd in code. Allow and Deny need no hint: Enter and Space on the focused button are enough.
- **Questionnaire keys** are the component's letters, A, B, C, and real shortcuts: pressing the key
  selects the choice.
- The Active Tool chip is 28 tall; extend its hit area to the toolbar row's full height.
