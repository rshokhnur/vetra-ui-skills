# AI component inventory

The 19 AI components in Vetra UI 1.0, with their properties as the Figma file names them. Defaults
are marked `(default)` or `on` / `off`. `↳` marks a property that reaches into a nested part or
holds the text of a boolean slot. Sizes are the master's; a width marked *placeholder* must be set
to Fill on every instance.

Every text property ships sample copy ("3 tool calls", "Search the codebase", "Run npm test in
/app"). It is a placeholder, not a value.

## Messages

**Message Bubble**: one message in a transcript.
- `Side` Incoming (default), Outgoing. `Style` Outline (default), Filled, Plain. `Tail` False
  (default), True. Plain exists only as Incoming, Tail False.
- `Message`; `Metadata` on; `Edited`, `Retry`, `Streaming` off; `↳ Streaming Line`.
- Outline and Filled hug up to `sizing-320`, 12 padding, `radius-12`; Tail squares the owning bottom
  corner to `radius-2`. Plain has no frame, caps at `sizing-512`, and is set to Fill.
- The nested Message Metadata's `Surface` is set per variant: On color on Outgoing Filled, Default
  everywhere else. Leave it.
- Streaming works on Incoming only.

**Message Metadata**: the time and receipt under a message.
- `State` None (default), Sending, Delivered, Read, Failed. `Surface` Default, On color.
- `Timestamp` "9:15 AM"; `Label` on (the status word), with one text property per word:
  `↳ Sending`, `↳ Delivered`, `↳ Read`, `↳ Failed`. The panel shows the one the current `State`
  uses; set all four once and switching `State` keeps them. 24 tall, hugs, never wraps or
  truncates: a long timestamp or status word pushes it past a narrow bubble, so keep both short or
  turn `Label` off.
- Used through Message Bubble's `Metadata`, or alone beside Reasoning on a reply header.

**Attachment Chip**: one attached file.
- `Type` Icon (default, 16 glyph), Image (28 thumbnail). `State` Ready, Uploading (a progress
  rail), Failed (an alert mark). Every variant 36 tall; 320 wide *placeholder*.
- `Name`; `Icon` (swap); `Meta` on, `↳ Meta` "PDF, 2.4 MB"; `Remove` on.
- It paints its own `background/b2` and `stroke/primary`, so it keeps contrast inside a Filled
  bubble. Never repaint it. On Image, give the Image layer an image fill.

**Marker**: a row between turns.
- `Type` Note (a system sentence with a glyph), Checkpoint (a rule and a Restore link), Separator
  (a labelled rule: "Today", "Worked for 42s"). 28 tall, 320 *placeholder*.
- `Label`; `Icon` (swap, `fold-vertical`); `Action` off (a Link on Note). Checkpoint and Separator
  nest an exposed Divider: its `Label` is the text, its `Align` Start or Center. Keep the Divider
  Horizontal.
- Disable Restore while a run is in progress. Keep markers off `background/b3` in dark.

## Thinking and running

**Reasoning**: the model's thinking, above its answer.
- `Streaming` False (default), True. `Expanded` False (default), True. Collapsed is one 28 line.
- `Body`; `Streaming Line`; `Skip` off (an "Answer now" link, only while Streaming).
- The label lives on the exposed `Trigger` (`x-Base/Reasoning/Trigger`): `Label` "Thought for 12s",
  `Streaming Label` "Thinking…", its own `Streaming` and `Expanded` (keep them equal to the parent's)
  and `State` Default, Hover, Focused.
- 480 *placeholder*. Keep it on the page or a card, never inside a Filled bubble: the body drops
  under 4.5:1 there.

**Agent Step**: one step of a run, as a status line.
- `State` Queued (default), Working, Waiting, Done, Failed, Cancelled, Timed out. 28 tall,
  320 *placeholder*.
- `Label` (one line, truncates); `Duration` on, `↳ Duration` "1.2s".
- Glyph and ink per state, read from the file. The label is `text/primary` in every state: the
  glyph carries the state, so never gray the label for Queued or Cancelled.

  | State | Glyph | Ink |
  | --- | --- | --- |
  | Queued | `list` | `gray/secondary` |
  | Working | `loader` (spins in code) | `accent/text` |
  | Waiting | `pause` | `yellow/text` |
  | Done | `check` | `green/text` |
  | Failed | `octagon-alert` | `red/text` |
  | Cancelled | `minus` | `gray/secondary` |
  | Timed out | `hourglass` | `orange/text` |

  Queued and Cancelled share gray and differ by silhouette.

**Chat Tool Call**: a disclosure group of tool calls.
- `State` Running (default), Done, Failed. `Expanded` True (default), False. Collapsed is 44.
- `Title` "3 tool calls"; `Summary` on, `↳ Summary` "3.4s"; `Rows` on; `Row 2`, `Row 3` on, `Row 4`,
  `Row 5` off; `Retry` off (a footer Button acting on the group).
- It paints its own `background/b1` and `stroke/primary`. 480 *placeholder*. Don't nest it two
  surface steps deep in dark.
- Each row is `x-Base/Chat Tool Call/Row`: an exposed Agent Step (`State`, `Label`, `Duration`),
  `Target` on with `↳ Target` in `mono-xs-12px/regular` (the path or command), `Output` off with
  `↳ Output` (what came back: "12 matches in 3 files", "exit 0"). Row heights: 28, 48 with Target,
  68 with Output.

**Multistepper**: a plan as numbered steps on a spine.
- `Nested` Off (default), On (one step opened over Agent Step sub-steps). `Step 4` on, `Step 5` off;
  steps 1–3 always show. 400 *placeholder*.
- Each step is `x-Base/Multistepper/Step`: `State` Done, Current, Todo, Failed; `Index` (write it:
  the component can't count); `Label`; `Meta` on, `↳ Meta` "2m 14s"; `Body` off; `Substeps` off;
  `Connector` on (set False on the last visible step).

**Streaming Caret**: the 2px insertion point that ends streaming text.
- `Size` Large 24 (default, beside 16px text), Medium 20 (beside 14px, the AI body size), Small 16
  (beside 12px). `accent/default`. Never on a `fill/secondary` wash in light, never on an accent
  fill. Figma doesn't animate it: in code it blinks at about 1Hz, 50% duty, and stays solid under
  `prefers-reduced-motion`.

## Asking the person

**Confirmation**: permission before an agent acts, then its receipt.
- `State` Pending (default), Allowed, Denied, Expired (receipts, one 44 row). `Tone` Default ·
  Destructive (Pending only; paints Allow red, removes Remember).
- `Title` (the action and its target); `Reason`, `Detail`, `Remember`, `Note`, `Meta` on, each with
  its `↳` text. Detail is an exposed Code Block with its header off.
- Exposed `Deny` (Button Small Outline) and `Allow` (Button Small Primary): set their labels, leave
  their Tone to the component. 480 *placeholder*.
- Glyph and ink per state: Pending `pause` in `yellow/text` (the Waiting step's), Allowed
  `user-check` in `green/text`, Denied `user-x` in `gray/secondary`, Expired `hourglass` in
  `orange/text`. None is circled, and red never marks the card. Title wraps while Pending and
  truncates to one line on a receipt.

**Questionnaire**: the agent's structured question.
- `Type` Single (radios), Multiple (checkboxes). `State` Default, Error (a required question left
  unanswered), Answered (Single only; a receipt of answers).
- `Title`, `Error Message`, `Summary`; `Progress` on ("Question 1 of 3"); `Description` on;
  `Optional` off (shows the hint and Skip together); `Choice C` on, `Choice D` off; `Other` on (an
  Input Field); `Back` off; `Answer 3` on, `Answer 4` off (receipt rows).
- Exposed `Choice A`–`D` (`x-Base/Questionnaire/Choice`: `Label`, `Description`, `Key`, `Selected`,
  `State`), `Other`, `Skip` ("Skip question"), `Next` ("Next question") and `Answer 1`–`4`
  (`x-Base/Questionnaire/Answer`: `Question`, `Answer`, `State` Answered, Skipped). 480
  *placeholder*; legible to 280.

## Grounding

**Sources**: the sources behind an answer, as a disclosure.
- `Expanded` False (default, one 28 line), True. `State` Default, Hover, Focused.
- `Title` "Used 3 sources"; `Favicons` on with `↳ Favicon 1`–`3` (swaps, all default to the Lucide
  `globe`; `Favicon 2`, `Favicon 3` on); `Row 2`, `Row 3` on, `Row 4`, `Row 5` off; `More` off (a
  "Show all" link past five). 480 *placeholder*.
- Each row is `x-Base/Sources/Row`: `Title`, `Domain`, `Favicon` (`globe`), `Index` off (a nested
  Citation Number), `Date` off on every row, `State` Default, Hover, Focused, Disabled.

**Citation**: the inline mark after a claim.
- `Type` Number (default, "1"), Domain ("react.dev", with `Count` "+2"). `State` Default, Hover ·
  Focused, Disabled. 16 tall.
- In Figma a citation can't sit inside a text node: set the answer as a wrap auto-layout of word
  text nodes at `spacing-4`, and place the Citation as the next sibling after the claim.

**Citation Card**: the preview a Citation opens.
- `Content` Snippet, Quote. `Title`, `Domain`, `Favicon`, `Snippet`, `Quote`; `Pager` on
  (`↳ Position` "1 / 3", exposed `Previous` and `Next`; disable the end with nothing left).
- Floating recipe: `background/b2`, `stroke/primary`, `box-shadow/md`, `radius-12`, 320 wide,
  8 below the citation, no arrow.

## Output

**Code Block**: monospace code with a filename header and copy control.
- `Overflow` Wrap (default), Scroll. `Diff` False (default), True (Wrap only).
- `Code`; `Header` on, `↳ Filename` (a basename; it truncates); `Copy` on; `Streaming` off,
  `↳ Streaming Line`. Diff: `Line 2`–`Line 6` on, each an exposed `x-Base/Code Block/Line` with
  `Type` Unchanged, Added, Removed and `Code` (leave the + or − out).
- It paints its own `background/b1` and `stroke/secondary`. 460 *placeholder*. Body is
  `mono-sm-14px/regular`, unhighlighted. Geist Mono draws `=>`, `>=`, `!=` as ligatures.

## Input

**Composer**: the prompt input at the foot of a transcript.
- `Value` Empty (default, shows `Placeholder` "Ask anything…"), Filled (shows `Prompt`). `State`
  Default, Hover, Focused, Disabled, Sending (Send becomes Stop).
- `Attachments`, `File 2`, `File 3` off (exposed Attachment Chips); `Tools` off (a Small Ghost
  Button); `Model` on (a Small Ghost Button with a chevron); `Active Tool` off (a Tiny Fill Button
  with the tool's glyph and an ×). Set labels and icons on the nested Buttons.
- 560 × 100 *placeholder*. Needs 231 wide as shipped, 379 with Tools on. The prompt is 16px on a
  24 line. A long prompt makes the box taller; it has no height cap and does not scroll.
  The round Send is the kit's only circle, on purpose.
- Send has three looks, 36 round:

  | Variant | Fill and stroke | Effect | Glyph |
  | --- | --- | --- | --- |
  | Empty, not Sending | `fill/secondary`, `stroke/secondary` | none | `send-horizontal` in `gray/quaternary`, off |
  | Filled, not Sending | `accent/default` | `actions/primary` | `send-horizontal` in `on-color` |
  | Sending, either Value | `accent/default` | `actions/primary` | `square` in `on-color`: Stop |

**Suggestion**: a prompt the assistant offers.
- `Type` Chip (default, hugs up to `sizing-320`, wraps, never truncates), Card (title and
  description, 256 wide). `State` Default, Hover, Focused, Disabled, Active.
- `Label`; `Icon` on, `↳ Icon` `sparkles`; `Description` on (Card only).

**File Upload**: a drop zone.
- `State` Default, Hover, Dragging (the dash turns solid accent), Focused, Disabled. No Error:
  a failed file shows on its Attachment Chip, a batch failure in an Alert above the zone.
- `Title`; `Mark` on (`↳ Mark` `upload`); `Hint` on. Height 124, 104 without Hint, 88 without Mark,
  68 with neither. Fixed or Fill, never Hug; 240 wide at least. Stack the file list as Attachment
  Chips under it, gap 8.

**Message Actions**: the action row under an assistant reply.
- `Feedback` None, Positive, Negative (the voted thumb fills). `Copied` False, True.
- `Copy`, `Thumbs`, `Regenerate`, `More` on; `Versions`, `Share` off. Each control is an exposed
  Icon Button (Small Ghost). `Versions` is the pager `x-Base/Message Actions/Versions`, whose `Position` (First, Middle, Last) disables
  the idle end.
- The master measures 160 × 20: each 36 Icon Button overflows a 16-wide slot, so the glyphs sit on
  the reply's text edge. Leave 8 clear around the row for the hit areas. More opens a Menu: Read aloud, Branch in new chat, Report
  answer.
