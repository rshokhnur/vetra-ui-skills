---
name: vetra-ai-ui
description: Builds chat, assistant and agent interfaces with Vetra UI's AI components (Message Bubble, Composer, Reasoning, Chat Tool Call, Agent Step, Multistepper, Confirmation, Questionnaire, Sources, Citation, Code Block, Suggestion and the rest). Picks the component for each thing an assistant or agent shows, sets its properties for the moment in the run, composes turns, transcripts, side panels and the composer dock the way the kit's AI screens do, and writes their copy. Use whenever you design, build, edit or review a screen with an AI chat, an assistant panel, an agent run, tool calls, approvals, citations or streaming output, in Figma or in code. Use vetra-components for every other component and vetra-tokens for every value.
---

# Vetra UI AI components

Every property and default is in `references/inventory.md`. The general components (Button, Menu,
Badge…) are `vetra-components`; colors, spacing and type are `vetra-tokens`.

When a component or property here is missing from the team's file, or the file shows one this
skill doesn't list, the file wins: use what it has and say so (`vetra-components`, rule 6).

## Rules that override everything below

1. **A run is shown by its parts, never by prose.** Thinking is Reasoning, a tool call is Chat Tool
   Call, a plan is Multistepper, a permission is Confirmation, a question with options is
   Questionnaire. Why: each part carries its own status glyph, live ink and receipt; a sentence
   saying "I ran the tests" carries none, and the reader can't tell running from done.
2. **One moment at a time, and every part agrees with it.** A mock shows one moment; an app moves
   through the phases in **Run phases** below, and at every instant every part matches the current
   one: a Composer is `Sending` while anything streams or runs, a Confirmation is `Pending` only
   while a step is `Waiting`, only the last reply streams. Why: a done answer under a running tool
   call reads as a bug. A screen with both a tool call and a streaming reply shows the call Done
   and collapsed, its result in the title, with one Working Agent Step for the writing; never a
   Running call above a streaming reply. A finished answer followed by a Pending Confirmation is the
   waiting moment: keep Message Actions on the reply above it and draw no follow-up Suggestions.
   The kit's Agent Deploy frame is a composite of moments on one canvas: it shows a streaming reply
   under a Pending Confirmation, no Waiting step and the Composer Default, to show every part at
   once. Take its parts and spacing from it, never its states; where it disagrees with this rule,
   the rule wins.
3. **Numbers agree across parts.** A Sources title "Used 3 sources" shows 3 favicons and 3 rows, a
   Chat Tool Call titled "2 tool calls" shows 2 rows, a Multistepper's Meta times add up to the
   run. Every Sources row is cited at least once, and no Citation number exceeds the row count.
   Nothing links them, so you do.
4. **These components are Fill.** Every width the inventory marks *placeholder* (320, 400, 460,
   480, 560) is set to fill its column. Why: Figma can't pass Fill from a master, so an unset
   instance keeps the placeholder and breaks at any other width.
5. **The moment is on screen.** The transcript is anchored to its end, so the newest part (the
   waiting Confirmation, the streaming line) sits just above the Composer dock. Collapse everything
   finished to make room: Done tool calls, settled Reasoning, a failure a later step has fixed. Why:
   the screen exists to show that moment, and a transcript that opens every past step pushes it
   below the fold. Measure before you size the frame: a cited reply with 2 sources, a Waiting step,
   a Confirmation and the dock fit about 800 in a 400 panel. When the moment needs more than the
   window, make the frame taller or let the top of the transcript scroll under the header; never
   drop a part to make it fit.
6. **Live is ink and one motion, never color on a card.** Running and streaming show as
   `accent/text` on a label or rail, a Streaming Caret, a loader glyph. A card never turns red or
   accent for its state, and a failure is a red glyph, not a red surface. Why: the ink and glyph
   already say live or failed; a colored card says it twice.

## Pick the component

Take the first branch that matches what the screen has to show.

```
A message
├── the person's ────────────────────────── Message Bubble, Outgoing, Filled
├── the assistant's reply ───────────────── Message Bubble, Incoming, Plain, Fill
├── a person-to-person or support thread ── Message Bubble, Incoming, Outline (Filled for the other side)
├── a file sent with it ─────────────────── Attachment Chip, above the bubble
└── its time and receipt ────────────────── Message Metadata, through the bubble's Metadata

What the assistant is doing
├── thinking ────────────────────────────── Reasoning
├── one step, as a status line ──────────── Agent Step
├── tool calls, grouped ─────────────────── Chat Tool Call
├── a plan of numbered stages ───────────── Multistepper (Nested = On to open one stage's steps)
├── a long job with a known end ─────────── a b1 card with a Progress bar (vetra-components)
└── writing ─────────────────────────────── Streaming on the reply bubble, Code Block or Reasoning

What the assistant needs from the person
├── permission to act ───────────────────── Confirmation
├── an answer from a set of options ─────── Questionnaire
└── an open question ────────────────────── a Plain reply; the person answers in the Composer

What the answer rests on
├── the claim's source, inline ──────────── Citation after the claim: Number with a Sources list, Domain without
├── the list of sources ─────────────────── Sources, after the answer
└── a source's preview ──────────────────── Citation Card, on hover or focus of a Citation

Code, commands and changes
├── code or output ──────────────────────── Code Block
├── a change to code ────────────────────── Code Block, Diff = True
└── the exact command a Confirmation runs ── the Confirmation's own Detail

Around the transcript
├── the prompt input ────────────────────── Composer
├── prompts to offer ────────────────────── Suggestion: Chip, or Card on an empty chat
├── a date, a model switch, a compaction ── Marker: Separator or Note
├── a point to go back to ───────────────── Marker, Checkpoint
├── feedback on a reply ─────────────────── Message Actions
└── files to upload before asking ───────── File Upload, with Attachment Chips stacked under it
```

Why:

- **Plain for the assistant, a bubble for the person.** Every AI screen in the kit answers in Plain:
  a reply is read, often long, and a frame around 500 words is noise. The person's short prompt
  keeps its Filled bubble so the two sides never blur. Outline and Filled Incoming are for threads
  between people.
- **Agent Step or Chat Tool Call.** An Agent Step is one line that says what is happening. Once the
  agent calls tools, group the calls in a Chat Tool Call: it collapses to one line with the group's
  status and opens to the calls with their targets and output.
- **Questionnaire or a plain question.** A Questionnaire for 2–4 known options the run can act on
  directly. An open question ("B2B only, or consumer too?") is a Plain reply: options would invent
  answers the person didn't have.
- **Number or Domain citations.** Number when a Sources list with indexed rows sits under the
  answer, so 1 finds row 1. Domain when there is no list and the site name has to carry the claim.

## Set the properties

**Message Bubble.**
- `Tail` and `Metadata` on for the last message of each run, `Metadata` off for the rest, in every
  transcript. Why: a run reads as one turn, and its last bubble carries the time and the receipt
  for all of it.
- Outline and Filled cap at `sizing-320`; Plain caps at `sizing-512`. Never override the Metadata's
  `Surface`: each variant sets the ink its fill needs.
- The person's own message is a run of its own: its last bubble keeps `Tail` and its `Metadata`.
- In another language set Metadata's status words, `↳ Sending`, `↳ Delivered`, `↳ Read`,
  `↳ Failed`, on each bubble's nested Metadata; the panel shows only the current State's. Why: a
  receipt left in English is the one foreign word in the transcript. If the words run long, turn
  `Label` off and keep the time and the glyph.
- A failed send is Outline with `Retry` on and Metadata `Failed`: Retry is a Link and disappears on
  an accent fill.

**Streaming.** Only the newest reply streams, and it is the last thing in the transcript.
- Bubble, Code Block, Reasoning: `Streaming` on, the finished text in the main text property, the
  line being written in `↳ Streaming Line`, `Metadata` off. The caret is the Streaming Caret part,
  never a typed `▌` or `|`.
- Caret size follows the text it ends: Medium beside 14px, Large beside 16px, Small beside 12px.

**Reasoning.** Streaming and Expanded only while the model is thinking; `Skip` on then adds "Answer
now". Collapse it and set `Streaming` False the moment thinking ends ("Thought for 12s"), not when
the answer exists: tool calls usually run in between, and an open body pushes them below the fold
(Rule 5). Set `Label` and `Streaming Label` on the exposed Trigger, and keep the Trigger's
Streaming and Expanded equal to the parent's.

**Chat Tool Call.** `State` is the group: Running while any row runs, Failed if any row failed,
else Done. Collapse it (`Expanded` False) once Done. Open it only while it is the current moment: a
run being watched, a Waiting row, or a failure nothing has fixed yet. Once a later step supersedes
it, collapse it; its title carries the result ("Ran the refund tests, 3 of 42 failed"). `Rows`
and `Row 2`…`Row 5` set how many calls show; each row's nested Agent Step takes its own State, and
`↳ Target` holds the path or command in mono. Turn on `Output` for what a call returned when it
matters to the reader. `Retry` is one footer button for the whole group.

**Agent Step.** `Duration` off until the step has run (Queued, Cancelled). Steps stack at gap 0.
- The writing step. In an agent run (the turn has tool calls or steps), add one Working Agent Step
  for the writing ("Write the summary") right above a reply when it starts streaming, and remove it
  when the reply ends: it is not a step of the plan, so it leaves no Done row behind. When another
  step already works while the reply streams (a deploy, a replay), that step is the one Working
  step and no writing step is added. A plain chat reply streams with its caret alone.

**Multistepper.** Write every `Index` yourself (the component can't count), set `Connector` False
on the last visible step, and put Meta (elapsed time) on Done, Current and Failed steps only. One
step is Current at a time.

**Confirmation.** `Tone` Destructive only when the action can't be taken back: data deleted, mail
sent, money moved. A deploy, a push or a merge can be rolled back, so it is Default, as the kit's
Agent Deploy is. Destructive has no Remember row by design, so don't add one. Turn `Detail` on
when there is an exact command, `Remember` only when a standing answer is safe. Once answered, it
becomes the receipt (`Allowed`, `Denied`, `Expired`) in place; it never disappears. In code the
receipt title wraps to two lines; the Figma master truncates it only because its height is fixed.

**Questionnaire.** 2–4 choices, `Other` on unless the choices are exhaustive. `Optional` on shows
Skip; a required question never offers it. Set Next to "Next question", and on the last question to
"Send answers". Answered collapses it to a receipt of short question names (about 12 characters).
A set of several questions shows one question at a time: one frame per question, named for it.

**Composer.**
- `Value` Empty shows the placeholder; Filled shows the prompt. `State` Sending while the assistant
  streams or runs: Send becomes Stop.
- `Model` on in a chat; off where the model is chosen elsewhere (a playground's settings) or fixed.
- `Tools` and `Active Tool` are the same tool off and on: show one. The Active Tool chip names the
  mode ("Deep research", "Edit this doc").
- `Attachments`, `File 2`, `File 3` show files waiting to send; set each chip's `Icon`.

**Attachment Chip.** `Icon` is the file's category, not its format: `file` for documents and unknowns,
`image`, `video`, `music`, `code-xml` for code and data, `package` for archives. Under 288 wide,
turn `Meta` off. `Remove` off once the file is sent.

**Suggestion.** Chip above the Composer (a row that scrolls, never wraps) or under a reply (a column
at gap 8, glyph `corner-down-right`). Card only on an empty chat, set to Fill: two columns at gap 8
in a main chat 512 or wider, one column at gap 8 in a side panel (a 256 card doesn't fit twice). Draw
none once the Composer has text.

**Message Actions.** On the last reply, and on any reply being rated or regenerated. Turn off Share
and Regenerate below a 360 column and let More carry them. `Versions` on only after a regenerate.

**Exposed parts** (Reasoning's Trigger, Confirmation's Deny and Allow, the Composer's Model,
Questionnaire's Choice A and Other and Next, a bubble's Metadata) are nested instances, found by name:
`props(reasoning.findOne(n => n.name === 'Trigger'), { Label: 'Thought for 12s' })`. A variant
value is a string (`Expanded: 'False'`); a boolean property is `true` or `false` (`Streaming: true`).

**Sources and Citation.** Swap every favicon, the header's `↳ Favicon 1`–`3` and each row's
`Favicon`, even for web pages: the default is the `globe`, which only says "a web page". Every
row's `Date` is off; turn it on where the date matters, in the product's locale. Sources title counts what it lists: "Used 3 sources" for the web, "Cited 3
pages" for one document, "Cited 2 moments" for a recording. A citation that isn't a web page swaps
the favicon to a file glyph (`file-text`, `mic`, `video`, `mail`) and writes the kind and the place:
"Transcript, 20:48". A source the reader can't open is `Disabled`.

## Run phases

An agent run moves through these phases; a mock picks one, an app passes through them in order and
can be stopped from thinking, working or streaming. Set every part to the current row.

The dock:

| Phase | Composer `State` | Placeholder | Send |
| --- | --- | --- | --- |
| idle | Default | "Ask anything…" | Send, off while `Value` is Empty |
| thinking | Sending | "Ask a follow-up…" | Stop, works |
| working | Sending | "Ask a follow-up…" | Stop, works |
| streaming | Sending | "Ask a follow-up…" | Stop, works |
| waiting for approval | Default | "Or tell the agent what to do instead…" | Send; no Stop, nothing runs. A message sent now is a Deny |
| done | Default | "Ask a follow-up…" | Send |
| stopped | Default | "Ask a follow-up…" | Send |

The parts (a dash: the part isn't on screen yet; earlier parts keep the state they settled in):

| Phase | Reasoning | Chat Tool Call | Agent Step | Confirmation | Streaming bubble |
| --- | --- | --- | --- | --- | --- |
| idle | – | – | – | – | – |
| thinking | Streaming, Expanded, Skip on | – | – | – | – |
| working | Collapsed, "Thought for 4s" | Running, Expanded; rows Queued, Working, Done | the current step Working | – | – |
| streaming | Collapsed | Done, collapsed, result in the title | one Working: the writing step, or the step already running | – or a receipt above | the newest reply, Streaming, caret, no Message Actions |
| waiting for approval | Collapsed | Done, collapsed | Waiting, the step the Confirmation is for | Pending, right under that step | none; the reply above is finished, with Message Actions |
| done | Collapsed | Done or Failed, collapsed | Done; no writing step | the receipt: Allowed, Denied or Expired | none; Message Actions on the last reply |
| stopped | Collapsed, "Thought for" the time so far | collapsed, Working and Queued rows Cancelled, titled how far it got | Working becomes Cancelled; no writing step | – | stopped where it was, caret gone, Message Actions on |

**Stop** settles every live part in place, then adds a Marker Note "You stopped the run" at the end
of the transcript:
- Reasoning still thinking: `Streaming` False, collapsed, "Thought for 3s" with the time so far.
- Chat Tool Call: Working and Queued rows become Cancelled with `Duration` off, Done rows keep
  theirs. The title says it stopped and how far: "Stopped after 2 of 4 calls". Never a Done check
  on a stopped group: a green check says the work finished. The kit has no Cancelled group state,
  so give the header the Cancelled step's `minus` in `gray/secondary` on a `gray/secondary` rail
  (a glyph override in Figma). Why: Failed would paint red for something nobody got wrong.
- Agent Step: Working becomes Cancelled, `Duration` off; the writing step is removed. A Waiting
  step can't be stopped: nothing runs while it waits, and a typed message answers it as a Deny.
- Multistepper: the Current step goes back to Todo with its Meta off.
- The streaming reply keeps the text it has, loses its caret and takes Message Actions.
- Focus stays in the Composer: move it to the textarea. Why: the Stop button turns into an empty,
  disabled Send, and a disabled button drops focus to the page.

## Compose

Measured from the kit's AI Screens (Research Answer, Deep Research, Agent Questions, Agent Deploy,
AI Writing Editor, Meeting Recap).

**The screen.** An open sidebar 256 wide on `background/b0`, or a 52 icon rail. The body is one
floating panel: `background/b1`, `stroke/secondary`, `radius-12`, inset 8 from the window on the
top, right and bottom. A side panel sits inside that body behind a 1px `stroke/secondary` left
edge (`stroke(panel, 'stroke/secondary', ['Left'])`; a Divider draws `stroke/primary` unless its `Stroke` is Secondary): 320 for an
assistant beside a document, 400 for an agent run or an assistant that calls tools. Panel headers
are 60 tall.

**The transcript.**

| Where | Column | Between turns | Inside one reply |
| --- | --- | --- | --- |
| A chat as the main view | centered, max 640 (512 beside a panel) | 24 | 12 |
| A 320 assistant panel | full width, padding 8 16 16 16 | 20 | 8 |
| A 400 agent panel | full width, padding 16 | 16 between every part | 16, reply to Message Actions |

- A turn is the person's message plus everything the assistant shows for it. Bubbles of one run sit
  2 apart; Agent Steps stack at 0.
- In the 400 agent panel the run's parts are siblings, not grouped into turns: the person's message,
  the plan card, the Chat Tool Call, the reply, the Confirmation, each 16 apart (Agent Deploy, Agent
  Setup). The reply carries 8 below its Message Actions for their hit areas.
- The person's message aligns right (`counterAxisAlignItems` MAX in Figma, `justify-end` in code).
- Every AI part fills the column; only bubbles and chips hug.

**The order inside a reply.** Top to bottom, leaving out what the moment doesn't have:

```
Reasoning ───────────────────── collapsed once thinking ends
Agent Step / Chat Tool Call ─── / Multistepper in a b1 card with a heading, for a plan
the answer ──────────────────── Plain bubble, Code Block, or the citation wrap
Message Actions ─────────────── 16 below the reply, on its own edge; Sources 8 under them
Confirmation or Questionnaire ─ in the transcript, when the run waits on the person
Suggestion chips ────────────── follow-ups, under the last reply only
```

A Confirmation goes right under the Agent Step it is waiting for. Why: the step reports execution,
the card asks for consent, and the two read as one moment. Word them differently: the step names
the tool's action ("Add questions to the bank"), the Confirmation's title the ask with its target
("Add 10 questions to the Fractions bank").

**Inline citations in Figma.** A Citation can't sit inside a text node, so a reply with inline
Citations is a wrap auto-layout instead of a Plain bubble: one text node per word in
`text-sm-14px/regular` `text/primary`, Citation instances between them, the word gap `spacing-4`,
the row gap `counterAxisSpacing` bound to `spacing-0`. A number stays in one node with what it
counts ("3 sources", Uzbek "10 ta savol"). In code it is ordinary inline text with links.

**The composer dock.** The Composer is never inside the scrolling transcript. It sits in a dock at
the bottom of its column, Fill, as wide as the transcript column:

| Where | Dock padding | Under the Composer |
| --- | --- | --- |
| Main chat | 0 24 12 24, gap 8 | a disclaimer |
| 320 assistant panel | 0 16 12 16, gap 8 | a disclaimer |
| 400 agent panel | 0 16 16 16 | nothing; a disclaimer when the answers cite sources |

The disclaimer is one line in `text-xs-12px/regular`, `text/secondary`, centered. A Suggestion chip
row is the only other thing in the dock, above the Composer. A Questionnaire is never docked: it
fills the transcript column, where the run asks it.

**Standalone cards.** A plan, a research job or a run summary in a transcript is a card:
`background/b1`, `stroke/primary`, `radius-12`, padding 12–16, gap 12, heading `text-sm-14px/medium`.

## Copy

- **Agent Step** labels are infinitives: "Run the test suite", "Read src/config.ts". Why: the label
  stays and the state changes; "Run the test suite" reads right as Queued, Working, Done and Failed.
- **Chat Tool Call** titles say what happened: past tense and the result once Done ("Ran the checkout
  tests, 42 passed", "Searched 3 files"), the task in -ing while Running ("Fixing refund rounding").
  Summary is the elapsed time or a count ("1.1s", "18 pages"). Retry names what it retries: "Retry
  the lint step".
- **Confirmation** Title is the action and its target, one clause, no dash: "Deploy checkout-api
  2.14.1 to production", "Push the refund fix to main".
  Deny and Allow are a verb-echo pair, never Cancel and OK: "Keep files / Delete 14 files", "Deny
  refund / Approve refund", "Don't deploy / Deploy". Reason says why and what it touches; Note says
  when it expires or whether it can be undone; Remember names exactly what it covers.
- **Reasoning:** "Thinking…" while live, "Thought for 12s" once settled.
- **Composer placeholder** fits the moment: "Ask anything…" on an empty chat, "Ask a follow-up…"
  after a reply, "Or answer in your own words" under a Questionnaire, "Or tell the agent what to do
  instead…" under a Confirmation, "Ask about this doc…" in a panel scoped to one thing.
- **Suggestions** are what the person would type, sentence case, no period: "Show me the rollback
  command", "Compare with the Q2 report".
- **Disclaimer:** "{Product} can make mistakes." plus what to check: "Check the cited sources." when
  the answer cites, "Review every edit." when it edits, else "Check important info."
- Times and dates in the product's locale ("9:41 AM" in en-US, "09:41" in most others);
  durations "45ms", "1.2s", "2m 14s"; a kind and a size or place joined by a comma ("PDF, 2.4 MB",
  "Transcript, 20:48"), never a middot.
- In another language, Agent Step labels take the form that names the action without a tense (the
  English infinitive, the Uzbek verbal noun in -ish), and the verb-echo pair still holds. `vetra-copy`
  has the rest.

## In code

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

## Before you finish

Check the whole screen and fix every miss:

- The screen shows one moment, every part's state agrees with it (Rule 2), and that moment is
  visible above the dock without scrolling (Rule 5).
- Counts agree: Sources title, favicons and rows; tool-call title and rows; plan times.
- Every AI component fills its column; no 320, 400, 460, 480 or 560 placeholder width is left.
- The assistant answers in Plain, or in the citation wrap; the person's messages are Filled and
  right-aligned.
- Every Citation number points at a Sources row, and every row is cited.
- Only the newest reply streams, with a Streaming Caret, and nothing under it is Done-and-waiting.
- The Composer is in a dock, outside the transcript, as wide as the column.
- No Cancel/OK on a Confirmation; no receipt card vanished after an answer.
- No placeholder copy: "3 tool calls", "Search the codebase", "Run npm test in /app",
  "Quarterly-report-Q3.pdf", "Summarize the deploy log" are the masters' defaults.
- No middot anywhere.
- In code: every phase in **Run phases** matches its row, Stop leaves no loader, caret or Done check
  on a stopped group, focus lands on the receipt after Allow or Deny and in the Composer after Stop,
  one polite live region announces each finished reply, request and receipt once, and under
  reduced motion the caret is solid and nothing spins or shimmers.

## References

- `references/inventory.md`: every AI component's properties, defaults, sizes and nested parts
- `vetra-components`: Button, Menu, Badge, Progress and the rest; the one-Primary rule
- `vetra-tokens`: colors, spacing, type, shadows and focus rings
