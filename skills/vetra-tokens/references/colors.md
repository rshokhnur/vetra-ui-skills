# Colors

Values below are the **Neutral** theme. Cool and Warm swap only the neutral ramp (last table); the ten
families never change with the theme. Contrast is WCAG 2, computed from these hex values; the three
ramps sit within 0.02 L of each other, so every ratio holds within a few hundredths in all three themes.

## Families

`default`, `hover` and `active` hold one value in both modes. The tints and `text` flip. Only
`accent` and `red` carry `fill-hover`, because only their tinted controls hover.

| Family | default | hover | active | text (light / dark) | fill | fill-hover | fill-active | stroke |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `accent` | `#398ef6` | `#1f78de` | `#0163c3` | `#0f64c0` / `#4696f9` | `#f1f6fe` / `#111d2d` | `#e2eefd` / `#14263d` | `#d4e5fd` / `#172f4d` | `#c4dbfb` / `#1d334f` |
| `red` | `#f7423d` | `#dc2829` | `#c00515` | `#bd161c` / `#ff5a51` | `#fef3f1` / `#2e1411` | `#fde7e4` / `#3e1815` | `#fddad6` / `#4e1c18` | `#fbccc6` / `#50221e` |
| `orange` | `#de6722` | `#bd581e` | `#a44503` | `#a3470f` / `#ee6e22` | `#fef3ee` / `#281810` | — | `#fddbcc` / `#442517` | `#fbceb9` / `#472a1c` |
| `brown` | `#b88059` | `#9e6d4c` | `#875a3a` | `#865b3c` / `#c4875d` | `#fbf4f0` / `#221b15` | — | `#f3dfd2` / `#392b21` | `#eed3c1` / `#3d2f26` |
| `yellow` | `#b08822` | `#96741f` | `#806003` | `#80610f` / `#ba8f1f` | `#faf5eb` / `#211c11` | — | `#f2e2c1` / `#372d17` | `#ecd7aa` / `#3a311d` |
| `lime` | `#7c9d23` | `#6a861f` | `#577103` | `#566f0a` / `#82a51e` | `#f3f8ed` / `#1a1f11` | — | `#dde9c7` / `#293217` | `#d0e1b3` / `#2e361d` |
| `green` | `#28a950` | `#249145` | `#047b33` | `#0b7733` / `#23b252` | `#eff9f0` / `#122015` | — | `#cfedd3` / `#1a361f` | `#bde5c2` / `#203924` |
| `sky` | `#289fb3` | `#238899` | `#047383` | `#0d7180` / `#22a7bc` | `#ebf9fb` / `#121f21` | — | `#c1edf6` / `#1a3338` | `#a8e5f1` / `#1f363b` |
| `violet` | `#9671f6` | `#8453ec` | `#703ed0` | `#6f41cd` / `#a07ffd` | `#f6f4fe` / `#1d182f` | — | `#e4dffd` / `#312551` | `#dad3fb` / `#342a53` |
| `pink` | `#e843a3` | `#cf268d` | `#b40478` | `#b21478` / `#f358af` | `#fef2f7` / `#2c1320` | — | `#fdd7e8` / `#4a1b34` | `#fac9e0` / `#4c2138` |

### Measured contrast, per family

| Family | white on default | on hover | on active | text on fill (L / D) | text on fill-active (L / D) | text on b1 (L / D) |
| --- | --- | --- | --- | --- | --- | --- |
| `accent` | 3.29 | 4.38 | 5.88 | 5.37 / 5.65 | 4.56 / 4.51 | 5.83 / 5.97 |
| `red` | 3.62 | 4.80 | 6.41 | 5.86 / 5.58 | 4.91 / 4.55 | 6.37 / 5.83 |
| `orange` | 3.46 | 4.59 | 6.12 | 5.56 / 5.61 | 4.67 / 4.52 | 6.06 / 5.88 |
| `brown` | 3.35 | 4.43 | 5.91 | 5.40 / 5.64 | 4.56 / 4.52 | 5.87 / 5.95 |
| `yellow` | 3.29 | 4.36 | 5.85 | 5.32 / 5.68 | 4.52 / 4.54 | 5.78 / 6.01 |
| `lime` | 3.13 | 4.16 | 5.57 | 5.30 / 5.89 | 4.51 / 4.70 | 5.72 / 6.27 |
| `green` | 3.05 | 4.03 | 5.40 | 5.26 / 6.08 | 4.51 / 4.75 | 5.67 / 6.46 |
| `sky` | 3.13 | 4.16 | 5.55 | 5.28 / 5.89 | 4.53 / 4.65 | 5.69 / 6.25 |
| `violet` | 3.51 | 4.74 | 6.39 | 5.82 / 5.68 | 4.91 / 4.59 | 6.34 / 5.93 |
| `pink` | 3.64 | 4.87 | 6.50 | 5.90 / 5.59 | 4.92 / 4.56 | 6.43 / 5.83 |

White on a solid `default` fill is 3.05–3.64:1, under the 4.5:1 text floor **by decision**: the ten
families are derived from the accent as one set. Never darken a family or put dark text on a solid
fill to raise it. Hover is 4.03–4.87:1 and active 5.40–6.50:1. `{fam}/text` clears 4.5:1 on its own
`fill` (5.26–6.08), on its pressed `fill-active` (4.51–4.92) and on `background/b1` (5.67–6.46).
`{fam}/default` as text on white is 3.05–3.64:1, which is why it is never text.

## Neutrals

Aliases into the theme ramp. Hex shown for the Neutral theme.

| Token | Light | Dark | Paints | On `b1`, light / dark |
| --- | --- | --- | --- | --- |
| `text/primary` | n-900 `#171717` | n-50 `#f5f5f5` | text only | 17.93 / 16.44 |
| `text/secondary` | n-500 `#737373` | n-400 `#a1a1a1` | text only | 4.74 / 6.94 |
| `text/tertiary` | n-400 `#a1a1a1` | n-500 `#737373` | text only | 2.58 / 3.78 |
| `text/quaternary` | n-200 `#d4d4d4` | n-600 `#525252` | text only | 1.48 / 2.29 |
| `gray/primary` | n-600 `#525252` | n-400 `#a1a1a1` | icons and neutral marks, never text | 7.81 / 6.94 |
| `gray/secondary` | n-500 `#737373` | n-500 `#737373` | icons and neutral marks, never text | 4.74 / 3.78 |
| `gray/tertiary` | n-400 `#a1a1a1` | n-600 `#525252` | icons and neutral marks, never text | 2.58 / 2.29 |
| `gray/quaternary` | n-200 `#d4d4d4` | n-700 `#404040` | icons and neutral marks, never text | 1.48 / 1.73 |
| `gray/on-fill` | n-900 `#171717` | n-0 `#ffffff` | a label on a neutral solid fill | — |
| `on-color` | white `#ffffff` | white `#ffffff` | labels and icons on a solid family fill | — |
| `background/b0` | n-25 `#fafafa` | n-950 `#0a0a0a` | surfaces | — |
| `background/b1` | n-0 `#ffffff` | n-900 `#171717` | surfaces | — |
| `background/b2` | n-0 `#ffffff` | n-800 `#262626` | surfaces | — |
| `background/b3` | n-0 `#ffffff` | n-700 `#404040` | surfaces | — |

`text/tertiary` and `text/quaternary` are below 4.5:1 in both modes: disabled and decorative text only.
`gray/tertiary` and `gray/quaternary` are below the 3:1 non-text floor: disabled and decorative marks only.

## Translucent tokens

The theme's darkest step in light and white in dark, at an alpha. They composite over whatever sits
underneath, so one token works on a card, a menu or a colored banner. In code they are `color-mix()`
over the theme step; Figma's code export prints an **opaque** fallback for them, so never keep it.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `fill/primary` | n-900 at 16% | n-0 at 16% | neutral filled button on hover; strongest wash |
| `fill/secondary` | n-900 at 8% | n-0 at 8% | pressed; hover on small targets; neutral chips, tracks and disabled fills |
| `fill/tertiary` | n-900 at 4% | n-0 at 6% | hover on buttons, menu rows and pagination; the segmented control's track |
| `fill/quaternary` | n-900 at 2% | n-0 at 2% | faintest wash, decorative |
| `stroke/primary` | n-900 at 12% | n-0 at 14% | outline buttons, dividers, the edge of popovers, menus and tooltips; field hover |
| `stroke/secondary` | n-900 at 6% | n-0 at 7% | cards, panels, fields at rest, table rules, disabled controls |
| `overlay/scrim` | black at 50% | n-950 at 70% | the backdrop behind a modal dialog or command palette |

`constant-colors/white` (`#ffffff`) and `constant-colors/black` (`#18181b`) never change with mode or
theme. Use them only where a color must not follow the theme, such as a shadow's color.

## Theme ramps

Pick the theme once for the whole product. Never reference these steps directly.

| Step | Neutral | Cool (Tailwind Gray) | Warm (Tailwind Stone) |
| --- | --- | --- | --- |
| `n-0` | `#ffffff` | `#ffffff` | `#ffffff` |
| `n-25` | `#fafafa` | `#f9fafb` | `#fafaf9` |
| `n-50` | `#f5f5f5` | `#f3f4f6` | `#f5f5f4` |
| `n-200` | `#d4d4d4` | `#d1d5dc` | `#d6d3d1` |
| `n-400` | `#a1a1a1` | `#99a1af` | `#a6a09b` |
| `n-500` | `#737373` | `#6a7282` | `#79716b` |
| `n-600` | `#525252` | `#4a5565` | `#57534d` |
| `n-700` | `#404040` | `#364153` | `#44403b` |
| `n-800` | `#262626` | `#1e2939` | `#292524` |
| `n-900` | `#171717` | `#101828` | `#1c1917` |
| `n-950` | `#0a0a0a` | `#030712` | `#0c0a09` |

## What each token may paint in Figma

Scopes limit which pickers offer a variable. The Plugin API ignores them, so check this table
before binding by script.

| Tokens | Text | Frame fill | Shape fill | Stroke | Effect |
| --- | --- | --- | --- | --- | --- |
| `text/*` | yes | — | yes | yes | — |
| `gray/*` (not `on-fill`) | — | yes | yes | yes | yes |
| `gray/on-fill` | yes | — | yes | — | — |
| `on-color` | yes | yes | yes | — | yes |
| `{fam}/default` | yes | yes | yes | yes | yes |
| `{fam}/hover`, `{fam}/active` | — | yes | yes | yes | — |
| `{fam}/text` | yes | — | yes | — | — |
| `{fam}/fill`, `fill-hover` | — | yes | yes | — | — |
| `{fam}/fill-active` | — | yes | yes | — | yes |
| `{fam}/stroke` | — | yes | yes | yes | — |
| `background/*` | — | yes | yes | yes | yes |
| `fill/*` | — | yes | yes | yes | yes |
| `stroke/*` | — | yes | yes | yes | — |
| `overlay/scrim` | — | yes | yes | — | — |
