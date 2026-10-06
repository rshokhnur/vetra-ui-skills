---
name: vetra-code
description: Implements Vetra UI designs in front-end code. Sets up the tokens for plain CSS, Tailwind CSS v3 or v4, or shadcn/ui, turns Figma design context from a Vetra file into the project's own components, and wires fonts, Lucide icons, focus rings, disabled states, modes and themes. Use whenever you write or review front-end code for a product built on Vetra UI.
---

# Vetra UI in code

Read the `vetra-ui` skill first (`../vetra-ui/SKILL.md`): it routes the task and holds the rules
that override this one, including the team's recorded changes to the kit. If it isn't installed,
tell the person to run `npx skills add rshokhnur/vetra-ui-skills --skill '*'` and continue with
this skill alone. Why: the seven skills are one set, and a partial install drops the routing.

`vetra-tokens` decides which token, `vetra-components` which component. This skill turns those
decisions into code in whatever stack the project uses.

## Rules that override everything below

1. **Color only through Vetra tokens.** Never a hex, never Tailwind's palette (`bg-gray-100`,
   `text-blue-600`), and never a `dark:` class for color. Every Vetra token already flips with the
   mode and the theme, so a `dark:` class means a raw color got in, and it won't follow Cool or Warm.
2. **Figma's generated code is a draft.** Rewrite every value it prints to a token (the table under
   Figma to code), and render every kit component with the project's own component, not the
   generated tree of divs.
3. **Icons are Lucide.** Render `lucide-react` by the icon's Figma name; the five filled glyphs
   Lucide lacks ship in `assets/icons/`. Why: the kit's icons are Lucide's glyphs under Lucide's
   names, so the component matches the Figma slot one to one, at every size. Never commit an asset URL from design context: it expires
   in 7 days.
4. **Disabled is tokens, focus is the Vetra ring.** Never `opacity-50` on a disabled control (the
   why is under States in `vetra-tokens`), and never `outline-none` without a ring in its place.

## Set up once

Before the first component, follow `references/setup.md`. It picks the files for shadcn/ui, Tailwind
v4, Tailwind v3 or plain CSS, exports the team's tokens when they rebranded, and covers the import
order, loading Geist, and modes and themes. Three of its rules fail silently when skipped:

- Import the token file with `layer(base)`. Why: unlayered, its text-style classes beat every
  utility, and their `font` shorthand cancels `font-semibold` and `tabular-nums`.
- Use `references/utils.ts` as `cn()`. Why: shadcn's `cn()` reads `text-xs-12px-medium` as a color
  and drops it, and the label renders at 16px with no error.
- Put the mode and theme on `<html>`, never on a wrapper div. Why: menus, dialogs and tooltips
  portal to `<body>`, outside the wrapper, and come out in the other mode.

## Figma to code

1. Call `get_design_context` on the node. Read the component descriptions and the style list it
   returns with the code. A frame too large for code comes back as a metadata tree only, or cut off
   (`OUTPUT TRUNCATED`, a component left open): call it again on each top-level section (with
   `excludeScreenshot: true`) and build each section as its own component. The component
   descriptions block can be cut the same way: it then ends in `OUTPUT TRUNCATED` and the
   descriptions after it, often the rules for the live parts, are missing. Read each missing one
   with a read-only `use_figma` call, `(await instance.getMainComponentAsync()).parent.description`
   (`.description` when the main has no set), or call `get_design_context` on one variant of it.
2. For every kit component in the frame (the descriptions name them: Button, Input Field, Menu…),
   use the project's component with the matching props: Figma's `Size`, `Style`, `Tone` become
   `size`, `variant`, `tone`. Build the component first if the project doesn't have it yet.
3. Rewrite everything that remains with this table:

| Design context prints | Tailwind with the bridge | Plain CSS |
| --- | --- | --- |
| `bg-[var(--background-b2,white)]` | `bg-background-b2` | `background: var(--background-b2)` |
| `text-[color:var(--text-primary,#171717)]` | `text-text-primary` | `color: var(--text-primary)` |
| `border-[var(--stroke-primary,#171717)]` | `border-stroke-primary` | `border-color: var(--stroke-primary)` |
| `border-[length:var(--stroke-1,1px)]` | `border` | `border-width: var(--stroke-1)` |
| `px-[var(--spacing-20,20px)]` | `px-5` | `padding-inline: var(--spacing-20)` |
| `h-[var(--sizing-52,52px)]` | `h-13` | `height: var(--sizing-52)` |
| `rounded-[var(--radius-14,14px)]` | `rounded-14` | `border-radius: var(--radius-14)` |
| `font-['Geist:Medium'] font-medium leading-[28px] text-[18px] tracking-[-0.18px]`, with `text-lg-18px/medium` in the style list | `text-lg font-medium` | class `text-lg-18px-medium` |
| `font-['Geist_Mono:Regular'] text-[12px] leading-[16px]`, with `mono-xs-12px/regular` in the style list | `font-mono text-xs` (`mono-2xl`: `font-mono text-2xl tracking-normal`) | class `mono-xs-12px-regular` |
| a raw `shadow-[…]`, or a `drop-shadow-[…]` filter, with `actions/secondary` or `box-shadow/md` in the style list | `shadow-actions-secondary`, `shadow-md`: always a box shadow, never `drop-shadow-*` | `box-shadow: var(--actions-secondary)` |
| `<img src="https://www.figma.com/api/mcp/asset/…">` in an icon slot | `<Search className="size-4" />` | the same component |
| a raw size: `size-[32px]`, `h-[36px]`, `w-[176px]` | `size-8`, `h-9`, `w-44` | the `--sizing-*` token, or the px on the scale |
| `gap-[var(--spacing-2,2px)]`, `p-[var(--spacing-0,0px)]` | `gap-0.5`; drop a zero | `gap: var(--spacing-2)` |
| `border-b-[length:var(--stroke-1,1px)]` beside `border-l-[length:var(--stroke-0,0px)]` | `border-b`; drop the zero sides | `border-bottom-width: var(--stroke-1)` |
| `rounded-tl-[var(--radius-12,…)] rounded-tr-[var(--radius-12,…)]` | `rounded-t-12` | `border-top-left-radius` and `-right-` on the token |
| `bg-gradient-to-b from-[var(--accent-default,…)] to-[var(--accent-active,…)]` | `bg-linear-to-b from-accent-default to-accent-active`; `/30` for an alpha stop | `linear-gradient(var(--accent-default), var(--accent-active))` |
| `style={{ backgroundImage: "linear-gradient(154deg, var(--a,rgb(…)) 14%, var(--b,rgb(…)) 86%)" }}` | `bg-linear-154 from-a from-14% to-b to-86%` | the same gradient without the fallbacks |
| `rounded-[var(--radius-full,10240px)]` | `rounded-full` | `border-radius: var(--radius-full)` |
| a `border` on a box with a fixed Figma height and auto-layout padding (a 52 toolbar padded 8) | `h-13` and no vertical padding, or 1px less padding on each bordered side. Figma draws the stroke inside the padding; a CSS border adds to it and the box grows by 2 | the same |
| a 1px `border-b` on a row of fixed content | the divider drawn inside: `after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-stroke-secondary` on a `relative` row | the same with `::after` |
| `flex-[1_0_0] min-w-px` | `min-w-0 flex-1` | `flex: 1; min-width: 0` |
| `tracking-[-0.3px]` beside a text style | drop it: the step carries its tracking | the style class |

- Tailwind steps are 4px, so divide Vetra's pixels by 4: `spacing-12` is `p-3`, `spacing-6` is
  `p-1.5`, `spacing-1` is `p-px`, `sizing-44` is `h-11`. Never change Tailwind's `--spacing`: shadcn's
  own `h-9` and `px-4` would change size with it.
- Drop every fallback. `fill/*`, `stroke/*` and `overlay/scrim` are translucent, and the fallback
  Figma prints for them is the opaque base color.
- In a shadcn project, `bg-accent` is shadcn's hover wash (`fill/tertiary`). The Vetra brand fill is
  `bg-accent-default`.
- A wash over a surface, such as an Outline control on hover, is `hover:wash-tertiary` on top of the
  control's own `bg-background-b2`.

## Icons

```
star-filled, star-half-filled, circle-filled, thumbs-up-filled or thumbs-down-filled?
├── yes ── copy assets/icons/{name}.svg (Lucide ships these as outlines only) and render it as an
│          inline <svg> component: its fills are currentColor, so it takes the token class on it
a brand logo?
├── yes ── export the SVG and commit it. The kit's brand marks are Boxicons, CC BY 4.0: credit them.
└── no ─── lucide-react. The Figma name in PascalCase: chevron-right → <ChevronRight />
```

- Size from the slot: 12, 16, 20, 24 → `size-3`, `size-4`, `size-5`, `size-6`. Leave the stroke width
  at Lucide's default and never set `absoluteStrokeWidth`: the kit's glyphs thin with their size,
  and Lucide's do the same by default.
- Color the icon with its own token (`text-gray-primary`, `text-red-text`); `vetra-tokens` picks it.
- Design context gives an icon as an image, not a name. Read every glyph name in one read-only
  `use_figma` call:

  ```js
  const root = await figma.getNodeByIdAsync(id)
  let page = root
  while (page.type !== "PAGE") page = page.parent
  await figma.setCurrentPageAsync(page) // without it nested icons come back empty, with no error
  const names = new Set()
  for (const x of root.findAll(x => x.type === "INSTANCE" && x.width <= 24 && x.height <= 24))
    names.add((await x.getMainComponentAsync())?.name)
  return [...names]
  ```

  Keep names without `=`: those are icons, named after their Lucide glyph (`house`,
  `chart-column`); a name with `=` is a host such as an Avatar. The Figma name is the Lucide name,
  so this replaces any "render the exported asset" step from a generic Figma-to-code skill.
- A team component in an icon slot (a "New" dot, a custom mark) is not an icon: build it as a
  component.
- A logo: read its vectors' fills with `use_figma`. Fills bound to variables become one committed
  SVG with `fill="var(--accent-default)"` and the like, and it follows every mode and theme. Render
  it inline (an `<svg>` component): an SVG loaded through `<img src>` or a CSS `background` can't
  read the page's custom properties, and the `var()` fill resolves to nothing. Only a
  logo with fixed fills needs a light and a dark export, swapped by `.dark`; never invert a color
  logo with a filter.
- Decorative art whose fills are bound (a glow, dots, an orb) is rebuilt in CSS from those tokens,
  so it flips with the mode; a committed image bakes one mode in. Figma's layer blur R is CSS
  `blur(R/2)`.

## Components

One code component per kit component, with props named after its Figma properties.
`references/families.ts` holds every family as complete class strings (tinted, filled, ink, mark)
for Badge, Counter, Icon Badge and tags. `references/button.tsx` is the pattern: a `cva` whose variants are Figma's `Size`, `Style` and
`Tone`, each value taken from the `vetra-tokens` States table, the focus ring chosen by the fill, and
disabled on tokens. Build every other component the same way from its entry in `vetra-components`'
inventory.

Without shadcn, copy `references/button.plain.tsx` (the same classes, no Slot, no shadcn names) and
`references/utils.ts` section B, after `npm i class-variance-authority clsx tailwind-merge`. Its
header gives the `@` alias for Vite and tsconfig.

Skeleton is static in Figma because a fill can't animate there. In code, pulse it with
`motion-safe:animate-pulse` (or a shimmer sweep of about 1.5s), never a bare `animate-pulse`, so
`prefers-reduced-motion` holds it still; put `aria-busy="true"` and a text label on the loading
region. Kbd renders a `<kbd>` and spells the chord out for screen readers ("Command K"; the
mechanism is at the end of `references/shadcn.md`).

**Tooltips.** Every icon-only control gets one (`vetra-components`). Mount `<TooltipProvider>` once
at the root, never per tooltip: it shares the open delay, so moving along a toolbar shows each label
without waiting again. A trigger that is already a `render` target nests:
`<TooltipTrigger render={<DialogClose render={<Button icon aria-label="Close" />} />}>`. The classes
are the Tooltip rows in `references/shadcn.md`.

**Show and hide without opacity.** A hidden part is `invisible` (`visibility: hidden`) or unmounted;
a blink (a streaming caret) animates `background-color` between the token and `transparent` with
`steps(1)`. Why: an element at `opacity: 0` still takes clicks and focus and stays in the accessibility
tree, where `visibility: hidden` drops all three. A whole layer's enter and exit fade
(`data-open:fade-in-0`) is motion, not a resting state, and stays.

Class names must appear whole in the source: Tailwind only generates what it can read, so
`` `bg-${fam}-fill` `` never compiles. Write a lookup of complete class strings instead.

## Before you finish

Search the code you wrote and fix every hit:

- a hex, `rgb(` or `oklch(` outside your copies of `vetra-tokens/assets/tokens.css`,
  `assets/vetra-tailwind.css` and `assets/vetra-shadcn.css` → the token
- a `var(--x)` that neither `tokens.css`, `assets/vetra-shadcn.css`, your own `:root` nor a
  `next/font` `variable:` (`--font-geist-sans`) defines, or `\/` inside a `var(--` → the variable
  was added or renamed in Figma after your export, or has no code syntax: export again
  (`references/setup.md`). If it is still missing, ask; never paste its fallback
- a `var(--…, …)` with a fallback → drop the fallback
- `figma.com/api/mcp/asset` → a Lucide component or a committed file
- `font-['Geist`, `text-[18px]`, `leading-[…]` → the text step
- a text-style class such as `text-sm-14px-medium` inside `cn()` or `cva` → `text-sm font-medium`, or
  confirm `lib/utils.ts` is `references/utils.ts`
- a Tailwind palette color, `\b(gray|zinc|slate|neutral|stone|blue|red|green|violet)-(50|[1-9]00|950)\b`,
  or `white`, `black` as a color → the token. `bg-blue-fill` and `text-gray-secondary` are Vetra tokens
- `dark:` on a color or a filter → delete it; the tokens flip on their own
- `opacity-50` or `opacity:` on a disabled state → the disabled tokens; on any paint or dot → a
  token at an alpha (`bg-on-color/24`); `opacity: 0` (or its class) as a hidden state →
  `invisible`. A layer's `fade-in-0` / `fade-out-0` enter and exit stays
- `from "cn"` in `components/ui` → `from "@/lib/utils"` (the sed in `references/setup.md`)
- `bg-border` on a divider → `bg-stroke-secondary` in a list or table, `bg-stroke-primary` in a menu
  or Select: the shadcn name resolves, so no other grep catches it
- U+2011, U+2009, U+202F or U+02BB in a string → `vetra-copy`, Other languages
- `outline-none` or `outline-hidden` on a focusable control (button, input, trigger, checkbox, a
  link) whose class string has no `focus-visible:shadow-ring-*` → add the ring. A popup container
  (dialog, popover, menu), a menu row that shows its own highlight, and a field whose wrapper
  draws the ring on `focus-within` may drop the outline
- an arbitrary length, `\w-\[\d+px\]` (`p-[10px]`, `size-[32px]`; a `calc()` that offsets by a
  stroke is fine), or a length in an inline style,
  `style=\{\{[^}]*(width|height|padding|margin)` → the nearest scale step as a class

Then open the page and run it, in light and in dark. The greps can't see structure, focus or
names, and in review most real defects came from this pass:

- **axe**: `@axe-core/playwright` (`await new AxeBuilder({ page }).analyze()`), or the axe DevTools
  extension. Fix every violation but one: white on a solid `{fam}/default` fill (3.05–3.64:1) is a
  decision in `vetra-tokens`; report it once as known, don't fix it. Typical hits: a duplicate `id`
  because an example renders twice (take ids from `React.useId()`, never a literal), a `role="list"`
  that owns a separator, a heading level that skips or repeats its parent's.
- **Keyboard**, with no mouse: Tab reaches every control in reading order; each shows the Vetra
  ring on focus; Enter and Space activate; inside a modal, Tab and Shift+Tab cycle without leaving
  it; Escape closes the topmost layer; focus then returns to the trigger. When an action unmounts
  the focused control (Allow turning into a receipt), move focus to what replaced it. The first
  Tab starts at the top of the page: never `focus()` or `scrollIntoView` a control on load or on
  every update. A custom menu or listbox: focus moves in on open, arrow keys and Home/End move,
  Escape and a choice return focus to the trigger, Tab closes it.
- **Clipping**: open every popup inside its real container. A menu opened inside an
  `overflow-hidden` or `overflow-clip` box is cut off: portal it to `<body>`.
- Every icon-only control has an accessible name and a Tooltip; `prefers-reduced-motion: reduce`
  (Playwright `emulateMedia({ reducedMotion: "reduce" })`) stops every pulse, shimmer and blink.

## References

- `references/setup.md`: the per-stack setup, import order, fonts, modes and themes, and light and
  dark side by side
- `assets/vetra-tailwind.css`: Tailwind v4 utilities named after the Figma tokens, and the `wash-*` utilities
- `assets/vetra-shadcn.css`: shadcn/ui's variables mapped onto Vetra's tokens
- `assets/vetra-tailwind.v3.js`: the same utilities as a Tailwind v3 preset
- `assets/icons/`: `thumbs-up-filled`, `thumbs-down-filled`, `star-filled`, `star-half-filled` and
  `circle-filled` as SVG with `currentColor` fills, exported from the kit's Icons page
- `references/button.tsx`: the Button for shadcn/ui, and the pattern for every other component
- `references/button.plain.tsx`: the same Button without shadcn: no Slot, Vetra prop names only
- `references/families.ts`: the color families as complete class strings
- `references/utils.ts`: the `cn()` that keeps Vetra's type, radius and shadow classes when merging,
  for the `cn` package (A) or clsx + tailwind-merge (B)
- `references/shadcn.md`: the class changes each shadcn component needs
- `vetra-tokens/assets/tokens.css`: the tokens themselves
