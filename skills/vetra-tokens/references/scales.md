# Scales

Every number in a Vetra token name is pixels, except opacity, which is percent. Nothing is built
off these lists: a value between two steps snaps to the nearer step, and a tie goes up.

## Spacing

Padding and gap. `--spacing-N`, Figma `spacing/spacing-N`.

`0 1 2 4 6 8 10 12 16 20 24 32 40 48 64 72 96 128`

There is no 14 or 18. `spacing-10` exists for one job: centring a 24 chip in a 44 field (Multiselect Medium). In Tailwind, a Vetra step is pixels, a Tailwind step is 4px:
`spacing-4` is `p-1`, `spacing-8` is `p-2`, `spacing-12` is `p-3`, `spacing-6` is `p-1.5`, `spacing-10` is `p-2.5`,
`spacing-1` is `p-px`.

## Corner radius

`--radius-N`, Figma `border-radius/radius-N`.

`0 2 4 6 8 10 12 14 16 20 24 32 full`

`full` is 10240 in Figma and `9999px` in CSS: a pill at any height.

| What | Radius | Why |
| --- | --- | --- |
| A row control | from its height, below | The corner grows with the control, so the four sizes look like one shape |
| Card, panel, popover, menu, dialog, sheet, calendar | `radius-12` at any size | Containers are not on the control ladder |
| Pill: counter, switch track, slider and progress track | `radius-full` | Round by construction |
| A box nested inside another | parent radius − inset | Equal radii on nested boxes leave a visibly wrong gap at the corners |
| Checkbox at 16 and 20 | `radius-4` | A 6 radius at 16px stops reading as distinct from a radio |

## The size ladder

Four control heights. Everything else about a control follows from which one it is.

| Size | Height | Radius | Label style | Icon | Button padding (x) |
| --- | --- | --- | --- | --- | --- |
| Tiny | 28 | `radius-8` | `text-xs-12px/medium` | 12 | 8 |
| Small | 36 | `radius-10` | `text-sm-14px/medium` | 16 | 12 |
| Medium | 44 | `radius-12` | `text-base-16px/medium` | 20 | 16 |
| Large | 52 | `radius-14` | `text-lg-18px/medium` | 24 | 20 |

Radius is `height / 4 + 1`. A control that spans several rows (a text area) takes its size step's
radius, not one from its rendered height. A surface smaller than a control, such as a tooltip bubble,
stays on this ladder: a 32px bubble takes `radius-10`.

Tiny clears the 24px minimum target but not 44px. It is for dense tables and toolbars.

## Stroke width

`--stroke-N`, Figma `stroke/stroke-N`: `0 0.5 1 2 4`.

Every border in the kit is `stroke-1`, drawn inside the box. `stroke-05` exists and nothing ships
with it. `2` and `4` are for marks such as a progress bar or a chart line, not for borders.

## Opacity

`--opacity-N`, Figma `opacity/opacity-N`: `2 4 6 7 8 12 14 16 24 30 40 50 70`.

Figma stores these as percent (8 is 8%); CSS takes the fraction (`0.08`). They exist to build the
translucent color tokens. Never dim a disabled control with `opacity`; use the disabled tokens.

## Sizing

Width and height. `--sizing-N`, Figma `sizing/sizing-N`.

`6 8 10 12 16 20 24 28 32 36 40 44 48 52 56 64 72 96 128 200 256 320 400 480 512 640 800`

| Step | Made for |
| --- | --- |
| 6, 8, 10, 12 | Small control marks: the radio dot, status dots |
| 16, 20, 24 | Icons, checkboxes, small avatars |
| 28, 36, 44, 52 | Control heights, the ladder above |
| 56 | A top bar or an app header |
| 200 | Navigation columns and sidebars |
| 320, 400 | Side panels and inspectors |
| 480 | A small dialog: a confirmation or one short form |
| 640 | A medium dialog, the command palette |
| 800 | A large dialog, such as settings with its own navigation |

## Breakpoints

The Figma file ships these as layout grid styles. **Fluid** keeps the margins fixed and stretches
the columns; use it for tools and dashboards. **Max-width** is the same grid capped at 1440 content
and centred; use it for reading-led pages. The two differ only at `display`.

| Breakpoint | Viewport | Columns | Gutter | Margin | Content |
| --- | --- | --- | --- | --- | --- |
| display | 1920 | 12 | 24 | 64 (240 max-width) | 1792 (1440 max-width) |
| 2xl | 1536 | 12 | 24 | 48 | 1440 |
| xl | 1280 | 12 | 24 | 32 | 1216 |
| lg | 1024 | 12 | 24 | 32 | 960 |
| md | 768 | 8 | 24 | 24 | 720 |
| sm | 640 | 6 | 16 | 24 | 592 |
| mobile | 390 | 4 | 16 | 16 | 358 |
