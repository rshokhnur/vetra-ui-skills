---
name: vetra-copy
description: Writes the words inside a Vetra UI interface, including button and link labels, dialog titles and their action pairs, field labels, placeholders and hints, error messages, empty states, alerts, badges, tooltips, menu items, numbers, dates and sample data, the way the kit's own screens write them. Use whenever you put text into a screen built with Vetra UI, in Figma or in code, including filling a mock with sample content, and when reviewing a screen's copy. Pair with vetra-components for which component carries the text and vetra-ai-ui for assistant and agent copy.
---

# Vetra UI copy

Read the `vetra-ui` skill first (`../vetra-ui/SKILL.md`): it routes the task and holds the rules
that override this one, including the team's recorded changes to the kit. If it isn't installed,
tell the person to run `npx skills add rshokhnur/vetra-ui-skills --skill '*'` and continue with
this skill alone. Why: the seven skills are one set, and a partial install drops the routing.

The kit's screens follow one voice: short, specific, sentence case, the action named on anything
you press. Chat and agent copy (tool calls, confirmations, reasoning) is in `vetra-ai-ui`. A product
in another language reads "Other languages" first.

## Rules that override everything below

1. **Say the specific thing.** "Delete 3 files", not "Delete". "Card ending in 4821", not "Payment
   method". Why: the label is often the only text read before the click, so it has to carry the
   object and, when there is more than one, the count.
2. **Sentence case everywhere in the product.** Buttons, titles, labels, menu items, tabs, badges:
   "Buy credits", not "Buy Credits". Only proper nouns and product names keep their capitals. Never
   ALL CAPS, including sidebar group labels: those are sentence case in `text-xs-12px/medium`,
   `text/secondary`. Why: Title Case turns every label into a heading, and a screen of headings has
   no hierarchy; caps read as shouting and are slower to read.
3. **No middot, no em dash, no en dash between words.** Join with a comma or split the sentence:
   "12 members, updated 2h ago", "PDF, 2.4 MB". A range keeps its en dash, closed between
   single terms ("$120–$480", "Jan–Jun") and spaced when a side has a space ("Feb 25 – Mar 2").
   Why: a middot row reads as metadata soup, and a dash hides which clause matters.
4. **Numbers agree across the screen.** A total equals its parts, "3 of 42 failed" leaves 39 passed,
   a count on a badge matches the list under it, a date in the past is in the past. Why: one wrong
   sum makes every other number on the screen untrustworthy, and reviewers check.
5. **No placeholder ships.** "Label", "Button", "Input text", "Hint text", "Lorem ipsum" and the
   kit's own sample defaults are placeholders. Replace every one.

A person's request wins ("use Title Case"): write what they asked. Suggest the kit's way once, in one
sentence in total, and never refuse. Text the person wrote themselves (a title, a name) is theirs:
never reword it to fit these rules.

## Other languages

The rules split in two. These hold in any language: say the specific thing, sentence case, no middot
or dash between words, numbers agree, no placeholder, the verb-echo pair, errors name the fix, empty
states give a reason and an action. These are English mechanics: verb first, month-first dates,
12-hour time, comma thousands, curly quotes, "2h ago", the sample personas.

In another language:

1. Before the first screen, write down the product's conventions once, in the
   `## Changes to Vetra UI` section of the project's `AGENTS.md` (or a file it links to): word order
   in a button, date, time and number formats, quotes and apostrophes, and a short glossary. Every later
   screen and every other agent follows that note.
2. Word order follows the language. A verb-final language keeps the verb last and the object and
   count in the label: Uzbek "10 ta savol qo'shish", "Kodni qayta yuborish".
3. Dates, times and numbers follow the locale: "12-noyabrgacha", "09:41", "5 daqiqa oldin".
4. Where the alphabet uses an apostrophe as a letter (Uzbek o', g'), keep the product's existing
   spelling; never curl it.
5. Sample people and places are native to the product's language (Dilnoza Karimova, not Sarah Chen).
6. Labels run longer than English: "25 characters or fewer" becomes about 32; budget buttons for
   twice the English length.
7. Check every special character against the font, in a screenshot of your own file. Geist has no
   narrow no-break space (U+202F), thin space (U+2009), non-breaking hyphen (U+2011) or modifier
   letter turned comma (U+02BB): depending on the file's font fallback, Figma draws nothing or a
   substitute, and a browser falls back to another font. Glue a number to its unit
   or group thousands with a no-break space (U+00A0); keep a hyphenated token together with
   `white-space: nowrap` in code. Swapping a glyph the font lacks for its nearest sibling (U+2011 to
   `-` with nowrap) is not rewording: do it, and tell the person.

## Buttons and links

```
What does the control do?
├── submits the form it sits under,
│   the only action there ────────── the verb: "Save", "Send", "Continue"
├── acts on something ─────────── verb + object: "Save changes", "Invite 3 people", "Export CSV"
├── declines or backs out ──────── the echo of the action: "Keep files" against "Delete 14 files",
│                                   "Don't save" against "Save", "Stay on plan" against "Cancel plan"
├── acknowledges a notice, the only button ─ "Close", or "Got it" when it confirms understanding
├── goes somewhere ─────────────── a Link naming the destination: "View invoice", "Read the release notes"
└── only an icon ───────────────── the Tooltip names the action as a button would: "Copy link", "More actions"
```

- Never "OK", "Yes", "Submit", "Click here" or "Learn more" alone. Why: none of them says what
  happens, so the person has to reread the dialog to choose.
- "Cancel" is right only when it abandons the open task (closing a form, a dialog that edits). When
  the primary action destroys something, the other button keeps it: "Keep files".
- Put a price or count on the button when the button spends or affects it: "Pay $25.00", "Delete 14
  files", "Retry from step 3".
- A button label is 1–4 words. If it needs more, the dialog title is doing too little.

## Titles and dialogs

- A dialog title is the question or the action with its object: "Delete 14 files?", "Buy credits",
  "Revoke this API key?". The buttons answer it, so the title and the primary button share the verb.
- The description says the consequence, in one or two sentences: what changes, whether it can be
  undone, what it costs. "The files are deleted, not moved to the trash."
- Page and card titles are nouns: "Billing", "API keys", "Recent runs".

## Fields

| Text | Rule | Example |
| --- | --- | --- |
| Label | A noun phrase, 25 characters or fewer, always shown | "Work email", "Reload amount" |
| Placeholder | An example value or the format, never the label again and never an instruction ("Enter a name") | "Production deploy", "name@company.com" |
| Hint, under the field | What the person needs to fill it right: a limit, a format, a consequence | "Shown on every invoice", "Up to 20 MB" |
| Error, under the field | What is wrong and how to fix it, in one sentence | "Enter an amount of $5 or more." |

- Never repeat the label as the placeholder. Why: the placeholder disappears on typing, so it is the
  wrong place for anything the person needs, and repeating the label spends it on nothing.
- An error names the fix, not the fault: "Enter a date after Sep 19", not "Invalid date". Never blame
  ("You entered…") and never "Oops".
- A character counter reads "75/60" and the hint says "15 over", so the fix is a number.

## Status and feedback

- **Badge:** one or two words, the state as an adjective or past participle: "Running", "Failed",
  "Awaiting approval", "Passed". Pair the word with the color `vetra-components` gives the state.
- **Alert:** the title says what happened ("Payment failed"), the body says what to do ("Update your
  card to keep your plan."), and its action button is the fix ("Update card"). Why: an alert
  without a next step is a notice the person can't act on.
- **Tooltip:** a label, no period, no link: "Copy link", "Filter rows". A keyboard hint rides after
  it: "Replace paragraph ⌘↵".
- **Progress and loading:** say what is happening with the count: "Uploading 3 of 5 files", "About 6
  min left". Never "Loading…" alone where the task is known.

## Empty states

```
Why is it empty?
├── nothing was made yet ──── what will show here + the one action that makes it:
│                              "No API keys yet" / "Create a key to call the API from your app." / [Create key]
├── a filter or search ─────── say so and offer the way back: "No runs match “failed”" / [Clear filters]
├── no permission ──────────── who can give it: "Ask an admin to give you access to billing."
└── by design ──────────────── say who it is for: "For your own components"
```

Why: an empty area with no reason reads as broken, and one with no action is a dead end.

## Menus and navigation

- Menu items are verbs for actions ("Rename", "Duplicate", "Delete project") and nouns for places
  ("Settings", "Billing"). The destructive item is last, after a divider, and names its object.
- Tabs and Segmented Control items are 1–2 words, nouns, parallel in form: "Summary / Transcript /
  Notes", "Monthly / Yearly".
- Breadcrumbs use the page titles exactly, so the last crumb matches the heading under it.

## Numbers, dates and units

- American English, dates month first: "Sep 2", "Sep 2, 2026", "Feb 25 – Mar 2". Times "9:41 AM".
  Another language takes its own locale (Other languages).
- Relative time under 24 hours old ("2 min ago", "2h ago"), a date after that.
- Thousands separators: "1,440 credits". Money with its symbol and cents where cents exist:
  "$25.00", "$18 per seat".
- Durations: "45ms", "1.2s", "2m 14s", "About 9 minutes".
- Curly apostrophes and quotes in content: "Don't", "“around 20 percent”". Straight quotes only
  inside code.

## Sample data in mocks

- People are fictional: the kit's personas (Sarah Chen, Alex Smith), or names native to the
  product's language, never a real person or a celebrity. Emails on your own domain or `example.com`.
- Companies, products and models are fictional too; never a real AI model name in a mock.
- Sample content is content, not a note to the builder: a card says "Legal reviews the pricing page
  on Thursday", never "Body text goes here".
- One scenario per screen: the files, totals, dates and names on it belong to the same story.

## Before you finish

Read every string on the screen and fix every miss:

- No "OK", "Yes", "Submit", "Click here", "Learn more" or bare "Delete".
- No Title Case outside proper nouns, no ALL CAPS, no middot, and no em or en dash between words,
  the page `<title>` and any label you add around a mock included.
- Every destructive button names its object and count; its partner echoes it.
- No placeholder repeats its label; every error says how to fix it.
- Every empty state says why it is empty and offers the next step, unless that action is already in
  view (the page header's Primary): then it says where the action is, or leaves it to the header.
- Every icon-only control has a Tooltip, and in code an `aria-label`, naming its action and object:
  "Revoke Staging sync", "Copy key". Why: an unlabeled icon is the one control with no text at all.
- Every number agrees with every other number on the screen.
- No "Label", "Button", "Input text", "Hint text" or lorem ipsum left.

## References

- `vetra-components`: which component carries each string, and the one-Primary rule
- `vetra-ai-ui`: copy for messages, tool calls, confirmations, reasoning and the composer
