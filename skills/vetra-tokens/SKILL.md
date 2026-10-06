---
name: vetra-tokens
description: Picks the Vetra UI token for every color, surface, border, text style, spacing, radius, shadow and focus ring, in Figma or in code, and ships them as CSS custom properties. Use whenever you style anything built on Vetra UI, wire light and dark mode or the Neutral, Cool and Warm themes, rebrand the accent, or check a design for raw values, including every use_figma write to a Vetra file.
---

# Vetra UI tokens

Read the `vetra-ui` skill first (`../vetra-ui/SKILL.md`): it routes the task and holds the rules
that override this one, including the team's recorded changes to the kit. If it isn't installed,
tell the person to run `npx skills add rshokhnur/vetra-ui-skills --skill '*'` and continue with
this skill alone. Why: the seven skills are one set, and a partial install drops the routing.

Every color, gap, radius, text style and shadow in a Vetra UI screen comes from a token.

## Rules that override everything below

1. **Semantic tokens only.** Never a raw hex, never a `neutral/n-*` step, never an off-scale number.
   Semantic tokens alias the theme ramp, so switching mode or theme moves them. A value pinned to
   `#737373` or `neutral/n-500` looks right in the mode you are viewing and wrong in the others.
2. **The number in a token name is pixels.** `spacing-8` is 8px, `radius-12` is 12px, `sizing-44`
   is 44px. In Tailwind 8px is `p-2`: never write `p-8` for `spacing-8`. Opacity is the one
   exception: `opacity-8` is 8%.
3. **Names in code.** Colors and effects: replace `/` with `-` (`text/primary` → `--text-primary`,
   `box-shadow/md` → `--box-shadow-md`). Numbers: the last segment only
   (`border-radius/radius-12` → `--radius-12`). Text styles: a class (`text-sm-14px/medium` →
   `.text-sm-14px-medium`). Every variable carries these names as its code syntax, so Figma's code
   export prints them. Copy `assets/tokens.css` into the project and import it once, before any
   other stylesheet; with Tailwind or shadcn/ui, follow vetra-code's import order instead.
4. **The file wins for names and values** (`vetra-ui`, When the file differs from the skills). Take a
   value from the team's file, never from the tables in `references/`: a rebranded team has other
   values under the same names.

## Color

Walk the tree for every paint. Take the first branch that matches.

```
Text?
├── on a solid {fam}/default, hover or active fill ───── on-color
├── on a solid gray fill ─── on-color on gray/secondary; gray/on-fill on a lighter gray
├── in a family's color: link, error, success, tag ───── {fam}/text, never {fam}/default
├── disabled: the control's own label or value ───────── text/quaternary
├── disabled: a field's label, a menu row ────────────── text/tertiary
├── hint, meta, timestamp, count, placeholder ────────── text/secondary
├── an unselected tab or segment ─────────────────────── text/secondary
└── anything else ────────────────────────────────────── text/primary

Icon?
├── on a solid fill ──────────────────────────────────── on-color
├── in a family's color ──────────────────────────────── {fam}/text
├── a filled mark: rating star, status dot, chart series ─ {fam}/default
├── disabled ─────────── gray/quaternary in a control, gray/tertiary in a menu row
├── in a list or menu row, or inside a field: search, chevron, clear ─ gray/secondary
├── beside a section heading or a title it labels ─────── gray/secondary
└── any other: a button's icon, a toolbar icon, a standalone icon ─ gray/primary

Surface?
├── the page ─────────────────────────────────────────── background/b0
├── card, panel, sidebar, table on the page ──────────── background/b1
├── floats over content: popover, menu, tooltip, dialog, toast ─ background/b2
└── floats over something already floating ───────────── background/b3

Selected item?
├── underline tab ───────── accent/text label, accent/default underline, no fill
├── pill tab, row in a list or menu ──────────────────── accent/fill + accent/text
├── active segment ──────── background/b2 + stroke/secondary on a fill/tertiary track
└── current page number, selected date ───────────────── accent/default + on-color

Solid fill that carries a label: primary button, filled badge, checked box?
└── {fam}/default; label and icon on-color. Neutral: gray/secondary; label on-color

Tinted element: tinted badge, alert, callout?
└── {fam}/fill + {fam}/stroke + {fam}/text. Neutral: fill/tertiary + stroke/secondary +
    text/primary, icon gray/primary

Neutral wash over a surface: hover, pressed, track, inset well?
└── fill/*, see States. Never a solid neutral.

Modal backdrop → overlay/scrim.  Border → see Borders.
```

Why:

- `text/*` never paints an icon and `gray/*` never paints text. The two ramps match in light and
  split in dark (`text/secondary` lightens to n-400, `gray/secondary` stays n-500), so a swap looks
  right until someone opens dark mode.
- A row or a field is read by its text, so its icon sits one step quieter than a button's.
- `{fam}/default` measures 3.05–3.64:1 as text on white. `{fam}/text` clears 4.5:1 on white, on its
  own tint and on its pressed tint, in both modes.
- Read text over a `fill/*` wash (a hovered row, an inset well) takes `text/primary`:
  `text/secondary` there measures about 4.4:1, a hair under the floor.
- `text/tertiary` (2.58:1) and `text/quaternary` (1.48:1) fail contrast in both modes. Nothing a
  person needs to read goes on them: not a group heading, a footer hint or a date.
- Figma's color picker offers `text/*` on a vector, because the scope includes shape fills. Check
  icons by script (`vetra-figma`'s audit), not by eye: the wrong ramp looks right in light.
- White on a solid family fill is 3.05–3.64:1, under the 4.5:1 floor, by decision: the ten families
  are derived from the accent as one set. Never darken a family, and never put dark text on a solid
  fill to raise the number. Hover and active clear 4.0:1 and 5.4:1.

## Glows, glass and gradients

- Translucency lives in a token's own alpha, never in a paint's or a layer's opacity. Why: binding or
  re-linking a variable resets the paint to the token's alpha, and a faded layer composites
  differently on every surface. Neutral washes are `fill/*`; anything else the kit lacks is a new
  token the team adds with its alpha in the value.
- On a solid colored or brand surface (a plan card, a hero), neutral washes and borders are
  `glass/*`, white at an alpha: `glass/fill` (16%) for a panel, `glass/fill-subtle` (8%) for a quiet
  one, `glass/stroke` (40%) for its edge, `glass/line` (24%) for a divider. Labels on glass are white,
  14px or larger and short: white on glass over a family fill measures 2.54–3.07:1.
- A glow, a halo or a decorative wash is `{fam}/glow` (`{fam}/default` at 24%, both modes), or the
  team's own glow tokens when the project's `## Changes to Vetra UI` names them. A halo is
  a shape filled with it plus a layer blur (blurs have no style); the container clips it so it stays
  behind its own card. Never a label on it: `{fam}/text` on a glow falls to 4.21:1 in dark.
- A gradient runs between tokens of one family, every stop bound: `accent/default` to `accent/active`.
  In code, Tailwind's `/NN` on a token (`to-accent-default/30`) is the same token at an alpha.
- `{fam}/fill` is a surface, not light: in dark it is near-black, so a glow built from it turns muddy
  or vanishes. Use `{fam}/glow`.

## States

| Kind | Rest | Hover | Pressed |
| --- | --- | --- | --- |
| Solid | `{fam}/default` + `actions/primary` | `{fam}/hover` + `actions/primary-hover` | `{fam}/active` |
| Tinted, accent and red only | `{fam}/fill` | `{fam}/fill-hover` | `{fam}/fill-active` |
| Outline | `background/b2` + `stroke/primary` + `actions/secondary` | add `fill/tertiary`, drop the bevel | add `fill/secondary`, no bevel |
| Ghost | nothing | `fill/tertiary` | `fill/secondary` |
| Neutral filled | `fill/secondary` | `fill/primary` | `fill/primary` + `fill/tertiary` |
| Field | `background/b1` + `stroke/secondary` | `stroke/primary` | none |

- A focused field keeps its rest border and adds `ring/accent`. A field in error takes `red/stroke`
  with `ring/red` shown at rest, and its hint turns `red/text`.
- Disabled: the label goes `text/quaternary`, the icon `gray/quaternary`. A control with a surface
  turns `fill/secondary`, a bordered one keeps a `stroke/secondary` edge, and a ghost stays bare.
  A field's own label goes `text/tertiary`; its hint stays `text/secondary`.
  Never dim with `opacity`: it composites with whatever is underneath, so the same control passes
  on one surface and fails on the next.
- States only darken, so a white label gains contrast on hover and press.
- Only a control hovers. A dot, a border or a chart series never takes `{fam}/hover`.
- A field changes its border on hover, never its surface: a tinted field reads as already filled in.
- Small targets (breadcrumbs, calendar days, segments) hover at `fill/secondary`: 4% on a box that
  small measures about 1.07:1 and nobody sees it. A component keeps one hover rung at every size.

## Borders

Every border is 1px (`stroke-1`), drawn inside the box.

```
├── tinted element ───────────────────────────────────── {fam}/stroke
├── field in error ───────────────────────────────────── red/stroke, with ring/red shown at rest
├── destructive outline control ──────────────────────── red/stroke; red/default on hover and pressed
├── outline button, divider, popover, menu or tooltip edge ─ stroke/primary
├── field on hover ───────────────────────────────────── stroke/primary
└── card, panel, field at rest, table rule, code block, disabled control ─ stroke/secondary
```

Why outline buttons and floating surfaces take the stronger stroke: in light mode `b1`, `b2` and
`b3` are all white, so a button or a popover on a card is white on white and its border is the only
edge it has.

## Elevation

| Surface | Fill | Border | Shadow | Radius |
| --- | --- | --- | --- | --- |
| Page | `b0` | none | none | none |
| Card, panel | `b1` | `stroke/secondary` | none | `radius-12` |
| Standalone card in an AI transcript (plan, run summary) | `b1` | `stroke/primary` | none | `radius-12` |
| Popover, menu, dropdown, tooltip, toast | `b2` | `stroke/primary` | `box-shadow/md` | `radius-12` |
| Modal dialog | `b2` | none | `box-shadow/lg` | `radius-12`, over `overlay/scrim` |

Light and dark separate surfaces differently. In light every surface above the page is white and
the shadow does the separating; in dark a shadow is invisible and the lighter surface does it. Keep
both the shadow and the surface step, and never make a shadow's color follow the mode. A modal
needs no border: two steps above the page, its lighter surface carries the edge in dark and
`box-shadow/lg` carries it in light.

## Focus rings

```
├── no padding: text link, breadcrumb ────────────────── ring/accent-text
├── filled solid accent/default ──────────────────────── ring/accent-on-color
├── filled solid red/default ─────────────────────────── ring/red-on-color
├── destructive control, field in error ──────────────── ring/red
├── neutral filled button ────────────────────────────── ring/gray
└── everything else ──────────────────────────────────── ring/accent
```

The ring's inner band follows the fill under it: an accent band on an accent fill measures 1.00:1.
In code a ring is a `box-shadow` on `:focus-visible` that replaces the rest shadow.

## Modes and themes

Mode (light, dark) and theme (Neutral, Cool, Warm) are independent. The ten color families never
change with the theme; only the neutrals do. Dark mode is a remap of the same tokens: never pick a
dark color by hand.

- **Figma:** set both on the top-level frame and let everything inherit. Never set a mode on an
  inner layer to fix one color.
- **Code:** put `data-mode` (or class `light` / `dark`) and `data-theme` on `<html>`. An element
  below `<html>` that switches either one carries both. Why: a custom property resolves where it is
  declared, so a subtree that sets only `data-theme` keeps the colors its parent resolved.
- **A team's own theme** (a mode added to `theme`, often the default) works like the three stock ones:
  its name is the `data-theme` value. The kit's showcase pages pin Neutral and stay gray.

**Rebranding the accent** to a team's color is a procedure, not a pick: follow
`references/rebrand.md`, which derives the options with `scripts/derive-brand.mjs`.

## Type

```
code, hash, path, ID, timestamp, figure in a data table ─ mono-*: Regular; Medium for a headline figure
stat, big number, display headline ───────────────────── SemiBold
heading that opens a page, card, section or dialog ───── Medium
label: names a control, field, menu row, dialog, alert ── Medium
title of a content row: List Item, a table cell ──────── Regular
everything else: body, description, value, hint, meta ── Regular
```

- SemiBold is for figures and display type only, and Avatar initials (a mark, read like a figure).
  A content row's title is Regular: it is read, not pressed. Headings, titles and labels are Medium: the kit's
  own Alert, Alert Dialog and Table headers are, and a SemiBold heading reads heavier than the
  components beside it.
- A control's label follows the control's size: Tiny 12, Small 14, Medium 16, Large 18.
- Body is 14 or 16. Nothing read goes below 12; `text-2xs` (10) is only a pill's count or the Tiny badge.
- Take a style whole. Never set its size, line height or tracking on their own.
- Figures that line up in a column get `tabular-nums`, set after the style class: `font` resets it.

## Scales

```
spacing (padding, gap) ── 0 1 2 4 6 8 10 12 16 20 24 32 40 48 64 72 96 128
radius ────────────────── 0 2 4 6 8 10 12 14 16 20 24 32 full
control height ────────── Tiny 28, Small 36, Medium 44, Large 52
control radius ────────── 8, 10, 12, 14 (height ÷ 4 + 1)
container radius ──────── 12 at any size: card, popover, menu, dialog, sheet
```

- Above 12 the steps grow by 4: no 14 or 18. Why: two gaps 2px apart read as a mistake, not a
  choice, so the scale keeps every step visibly different.
- A value between two steps snaps to the nearer one; a tie goes up.
- A box nested in another takes the parent's radius minus the inset: a `radius-12` card with 4px
  padding holds `radius-8` children.
- Pills (counters, switch and slider tracks) are `radius-full`.

## Before you finish

Search what you wrote and fix every hit:

- `#`, `rgb(`, `hsl(` or a named color outside `tokens.css` → the token the tree gives
- a pixel value that is not on a scale → snap it
- `{fam}/default` on text, `text/*` on an icon, `gray/*` on text → walk the tree again
- `text/tertiary` or `text/quaternary` on anything a person reads → `text/secondary`
- an `opacity` on a paint or a layer to fade a color → a token with its own alpha
- a `font-size` or `line-height` set on its own → the style class
- `opacity` on a disabled state → the disabled tokens

## References

- `references/colors.md`: every color in both modes and all three themes, measured contrast, Figma scopes
- `references/scales.md`: spacing, radius, stroke, opacity, sizing, the size ladder, breakpoints
- `references/typography.md`: the 44 text styles
- `references/effects.md`: shadows, focus rings and bevels, and where each one goes
- `references/rebrand.md` and `scripts/derive-brand.mjs`: a team's brand color as the accent, and a
  tinted neutral theme
- `assets/tokens.css`: every token as a CSS custom property, with modes and themes wired
