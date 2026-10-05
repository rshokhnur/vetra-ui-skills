# Effects

22 effect styles: 5 shadows, 14 focus rings, 3 bevels. In CSS each one is a `box-shadow` value,
named like the style: `box-shadow/md` → `--box-shadow-md`, `ring/accent` → `--ring-accent`,
`actions/primary` → `--actions-primary`.

CSS paints the first shadow in a list on top; Figma paints the last layer on top. The layers in
`tokens.css` are already reversed for CSS, so use each value whole.

## Shadows

Three layers each, contact, mid and ambient, from one light source straight above. The color is a
fixed `#18181b` in both modes. Never make a shadow's color follow the mode: in dark mode shadows are
nearly invisible by design, and the lighter surface does the separating there.

| Style | Layers: y / blur / alpha | Use |
| --- | --- | --- |
| `box-shadow/sm` | 1/1/5%, 2/2/4%, 4/3/3% | No kit component uses it. A raised element that stays in the page flow |
| `box-shadow/md` | 1/2/5%, 4/4/4%, 9/5/3% | Anything one step above what it floats over: popover, menu, dropdown, tooltip, citation card |
| `box-shadow/lg` | 3/6/6%, 12/12/5%, 27/15/3% | Modal dialogs and the command palette |
| `box-shadow/xl` | 7/14/8%, 28/28/7%, 63/35/4% | No kit component uses it |
| `box-shadow/2xl` | 17/34/10%, 68/68/9%, 153/85/5% | No kit component uses it |

No layer has spread, so no shadow draws a border. A shadow says how high a surface is; a stroke
says where its edge is.

## Focus rings

Two layers: a 4px halo in the family's `fill-active` outside the box, and a 2px band in the
family's `default` inside it. The band carries the contrast: the halo alone measures 1.3:1 against
a card in light and 1.5:1 in dark. Never ship a halo without its band.

| Ring | Where | Band |
| --- | --- | --- |
| `ring/accent` | Every focusable control no other row covers | `accent/default`, inside |
| `ring/accent-on-color` | A control filled solid `accent/default`: primary button, checked checkbox, selected radio, switch on, selected date, current page number | `on-color`, inside |
| `ring/accent-text` | A control with no padding: text link, breadcrumb | `accent/default`, **outside**, so it doesn't cut the glyphs |
| `ring/red` | A destructive control; a field in error | `red/default`, inside |
| `ring/red-on-color` | A control filled solid `red/default` | `on-color`, inside |
| `ring/gray` | A neutral filled button | `gray/primary`, inside; the halo is `fill/secondary` |
| `ring/green`, `yellow`, `orange`, `violet`, `sky`, `pink`, `lime`, `brown` | A control on that family's tint | that family's `default`, inside |

The band follows the fill under it, not the component: an accent band on an accent fill measures
1.00:1.

A focused control wears the ring instead of its bevel: in code, `:focus-visible { box-shadow:
var(--ring-accent); }`, replacing the rest `box-shadow`. The halo extends 4px past the box, so a
focusable control inside an `overflow: hidden` container needs 4px of room or the halo is cut off.

## Bevels

A lit top edge that makes a control read as a physical surface.

| Style | Where |
| --- | --- |
| `actions/primary` | A solid-filled control at rest: primary button, checked checkbox, selected radio, switch on, selected date, send button |
| `actions/primary-hover` | The same control on hover |
| `actions/secondary` | A neutral control at rest: outline button, slider and switch knobs, the active segment, stepper buttons |

Pressed, focused and disabled carry no bevel. Tinted and ghost controls never have one.
