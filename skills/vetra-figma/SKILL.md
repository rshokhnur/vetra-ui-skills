---
name: vetra-figma
description: Builds and edits screens in Figma with the Vetra UI kit through the Figma MCP tools (use_figma, search_design_system, get_screenshot), placing kit instances, binding every value to the kit's variables and styles, setting mode and theme, swapping icons and auditing the result. Load it before any use_figma call on a file that uses Vetra UI, as pages or as a library.
---

# Building with Vetra UI in Figma

Read the `vetra-ui` skill first (`../vetra-ui/SKILL.md`): it routes the task and holds the rules
that override this one, including the team's recorded changes to the kit. If it isn't installed,
tell the person to run `npx skills add rshokhnur/vetra-ui-skills --skill '*'` and continue with
this skill alone. Why: the seven skills are one set, and a partial install drops the routing.

`vetra-components` decides which component, `vetra-tokens` which token; this skill puts them on
the canvas. Paste `references/helpers.js` at the top of every `use_figma` script (the Audit block at
its end only in the script that finishes a pass): every helper named below is in it, and each one
was run against the kit.

## Rules that override everything below

1. **Build on your own page.** Never edit the kit's pages: Cover, Changelog, Use Cases, Components,
   AI Components, Charts, Icons, Logos, Colors, Typography, Numbers, Effects, Grids, Avatars, Flags
   and x-Base. They hold the masters and the kit's reference screens; an edit to a master changes
   every screen that uses it.
2. **Place instances.** Never detach one, and never redraw a component the kit already has: a
   detached or redrawn copy loses its link to the kit's masters.
3. **Bind every value.** Colors to variables, text to text styles, shadows and rings to effect
   styles, padding, gap, radius and stroke weight to number variables. A raw value that matches a
   token renders right today and breaks on the next mode or theme switch.
4. **Set light or dark, and the theme, once, on the top-level frame.** Everything inside inherits.
   Why: a layer with its own mode stops following the frame, so switching the frame to dark leaves
   that layer light.
5. **End every pass with `get_screenshot` of the frame, the `audit` helper and the dark check**
   (Before you finish). Nothing is done while the audit returns issues.
6. **Translucency comes from a token, never from opacity** (`vetra-tokens`, Glows, glass and
   gradients, has the why): use `fill/*`, `stroke/*`, `overlay/scrim` or `glass/*`. When no token fits,
   stop and ask. If the person agrees to a new one, add it to the colors collection with a light and
   a dark value (alpha in the value), its scopes and the WEB code syntax `var(--name)`, then tell them
   to re-export `tokens.css`.

**Every script** starts with `helpers.js`, fetches the nodes it edits by id
(`await figma.getNodeByIdAsync(id)`) and sets its page with `await figma.setCurrentPageAsync(page)`.
Why: the current page resets on every call, and another agent in the same file may have moved it.

## Find the kit

```
Does this file have the kit's pages (Components, Icons)?
├── yes: local. Use the helpers:
│     componentSet('Button'), icon('search'), vars, textStyles, effectStyles
└── no: a library.
      search_design_system, one query per call: the server drops the rest of a batch.
      Keep only results whose libraryName is your Vetra UI library.
      Import: importComponentSetByKeyAsync(key), importComponentByKeyAsync(key) for one icon,
      importStyleByKeyAsync(key), and variables through figma.teamLibrary (end of helpers.js).
```

**Check the names before you build** (`vetra-ui`, When the file differs from the skills, decides what
to use). In Figma: when `componentSet`, `icon` or `vars` throws on a name a skill gives, never retry
with a guessed spelling. Why: a retry with an invented name either throws again or binds the wrong
thing. If the team renamed the kit
pages, the kit pages are the ones holding the component sets: treat them as Rule 1 does.

Why filter by library: other kits the workspace subscribes to also have a "Button", and a search
for "Button" from the Vetra file ranks another kit's Button first.

Read other pages with `await page.loadAsync()` (the `kitPage` helper does this). Switch the current
page at most once per script, and never remove the page you are on: switch away first.

## Place a component

1. `await instance(parent, 'Button', { Size: 'Small', Style: 'Outline', Label: 'Save changes' })`.
   Append to the auto-layout parent before sizing: `FILL` and `HUG` only work inside one.
2. `props` takes plain names for every property and writes them in three passes: variants
   (`Size`, `Style`, `Tone`, `State`), then text and booleans, then icon swaps. It throws with the
   valid options when a variant value doesn't exist. A variant switch drops the instance's other
   overrides: labels, icons, icon colors, and any fill or stroke you set on a layer inside. When you
   change a variant later, re-apply them all, and read them back in the next call. Style a state
   through the component's own properties; when the kit has no property for it, name the override
   in your report.
3. Icons: turn the slot on and swap it in one `props` call, which writes them in separate passes,
   then color it:
   `props(btn, { 'Left Icon': true, '↳ Left Icon': (await icon('save')).id })`, then
   `iconColor(btn, 'on-color')`. A swapped icon keeps the icon master's own `gray/primary`, so a
   Primary button shows a dark glyph until you do. The color comes from `vetra-tokens`' Icon branch:
   `on-color` on any solid fill, `{fam}/text` on a tinted control, `gray/primary` elsewhere.
   `iconColor` paints the vector's fill; never add a stroke to an icon: kit icons are outlined
   shapes, and a stroke draws them bold. Icon names are Lucide's: `chevron-right`, `trash`, `search`.
4. Nested state and exposed parts live on nested instances, found by layer or component name with
   `part(inst, name)`; `vetra-components/references/inventory.md` lists which. `props(tabs.findOne(n => n.name === 'Tab 2'), { Active: 'On' })`,
   `props(reasoning.findOne(n => n.name === 'Trigger'), { Label: 'Thought for 12s' })`.
5. Change text through the instance's text property (`Label`, `Message`, `Title`), not by editing the
   text node inside it. The property is the component's public name for that text; the layer under
   it can be renamed or restructured in the next kit version.
6. Never call `resetOverrides()` to undo one change: it resets variants, counters and every other
   override too. Undo the one property you changed.

## Draw your own layout

Only for what the kit doesn't have: the page, a card, a row, a section.

- `box(parent, 'Card')` makes an auto-layout frame with no fill and no clipping. `createFrame` and
  `createAutoLayout` paint white and clip by default, which shows the moment the frame is viewed in
  dark mode.
- `fill(node, 'background/b1')`, `stroke(node, 'stroke/secondary')` (1px, inside, weight bound; `['Left']` for one edge),
  `radius(node, 'border-radius/radius-12')`, `space(node, { pad: 20, gap: 16 })`.
- `await text(parent, 'Workspace', 'text-lg-18px/medium', 'text/primary')`. Take style names from
  `textStyles`; never type a style id.
- `await effect(node, 'box-shadow/md')`.
- `resize()` sets both axes to `FIXED`: re-apply `HUG` and `FILL` after it. A hugging parent
  collapses a filling child to zero, so give the parent a width first. Never set `HUG` on an
  instance: its size belongs to its master.
- A row with a title at the left and a control at the right: keep the bound gap and set the title to
  `FILL`. `SPACE_BETWEEN` over a bound gap leaves a dead value that wins later.
- Build to reflow. Containers `FILL` or `HUG`; a width that must stop growing gets `maxWidth`, bound
  to a `sizing/*` token where one fits. `minWidth` and `maxWidth` can't be bound on a text node or set
  on an instance: wrap it in a frame and constrain the frame. No spacer frames: the bound gap spaces
  siblings. Check a page at 1280 and 1920 on a temporary clone, then delete the clone.
- Build a screen's shell once, then `clone()` the frame for each state and change only what differs.
  A clone lands on the page even when the original sits in a Section: append it to the section
  yourself. It keeps the original's mode, so call `mode(clone, 'dark')` for a dark copy.
- An instance set to fill a wider parent can keep its old text layout: check the screenshot.
- Never set `leadingTrim` on text: it detaches the text style.

Why `fill` resolves the token before binding it: `fill/*`, `stroke/*` and `overlay/scrim` carry
their own alpha. A paint built from the color alone binds at 100%, and a 4% wash renders solid
black.

## Modes

`mode(frame, 'dark')` for light or dark, `mode(frame, 'cool', 'theme')` for Neutral, Cool or Warm,
or a theme the team added. A frame with no pin inherits the collection's default mode; the kit's
own showcase pages pin Neutral, so a team's default theme shows on new pages only.
Never assign `explicitVariableModes`: it is read-only, and its throw rolls back the whole script.

## Before you finish

1. `get_screenshot` on the frame. Look at it: the audit can't see a wrong component choice, clipping
   or a label that wraps.
2. `return audit(frame)`. On your own layers it lists raw fills, strokes, stroke weights, paddings,
   gaps and radii, text and shadows without a style, spacer frames, and `text/tertiary` or
   `text/quaternary` on text. At every depth, inside instances too, it lists layer opacity, a paint
   whose opacity differs from its token's alpha, `text/*` on an icon or shape, `gray/*` on text, a
   stroke on an icon, placeholder text, a component's sample copy still showing, and square
   placeholder icons. Fix every line and run it
   again. A disabled control's own label is the one `text/tertiary` hit you keep; say so.
3. Dark check, even when the person asked for light only: clone the top-level frame,
   `mode(clone, 'dark')`, screenshot the whole clone and run `audit(clone)`, then delete the clone.
   Look for text and icons that fade into their surface. Screenshot the whole frame, never an inner
   layer alone: a layer with no fill renders on the transparent canvas and its white text looks
   missing. A contrast miss inside a kit component goes in your report, not into an override.
   In a file you may only read, skip the clone: `resolveVar(variable, 'dark')` returns each bound
   paint's dark color (aliases and color × opacity resolved), and you compare text and icons against
   the nearest filled ancestor by hand. Say in the report that dark was checked from bindings.
4. A failed `use_figma` call changes nothing. Read the error, fix the script, run it again.
5. The Figma MCP allows about 15 calls a minute. Merge writes into fewer, larger scripts, and take
   screenshots inside a script with `await frame.screenshot()`: it returns the image with the result,
   where `get_screenshot` returns a link to download.

## Working with other agents

- After a context compaction (`vetra-ui`, rule 5), read this skill, `vetra-components`' Compose table and `vetra-tokens`'
  trees again before the next write to the file.
- A brief for another agent that will write to the file names the skills, not just the kit:

  > Before any `use_figma` call, load `figma-use`, `vetra-figma`, `vetra-components`,
  > `vetra-tokens`, and `vetra-copy` if you write any text. Paste `helpers.js` at the top of every
  > script. Fetch nodes by id and set the page in every script. Touch only [the frame or section].
  > Finish with a screenshot, the audit and the dark check. Report kit gaps apart from your fixes.

- Give each agent its own frame or section, and never two agents the same node.
- Rules you find yourself repeating in every brief belong in the project's own notes, and a gap in
  these skills goes in your report to the person.

## References

- `references/helpers.js`: the helpers, the audit, and the library path
- `references/traps.md`: what goes wrong in the Figma API, symptom and fix, most likely first
