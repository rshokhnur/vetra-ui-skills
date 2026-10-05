# shadcn/ui on Vetra UI

`assets/vetra-shadcn.css` points shadcn's variables at Vetra's tokens, so every shadcn component picks
up Vetra's colors. What it can't fix is each component's own classes: shadcn draws borders with
`ring-1 ring-foreground/10`, dims disabled controls with `opacity-50`, adds `dark:` overrides and uses
its own sizes. Edit these classes in `components/ui/*` when you first use a component.

Class names below are what `shadcn add` installs on the **`base-nova`** style, the one
`shadcn init -d` writes (`"style"` in `components.json`). It is built on Base UI, which differs from
Radix in three ways you will meet in every file:

- State is a bare data attribute: `data-open`, `data-closed`, `data-checked`, `data-unchecked`,
  `data-disabled`, `data-highlighted`, `data-active`, `data-side`, and `data-starting-style` /
  `data-ending-style` for enter and exit. Radix writes `data-[state=open]`, `data-[state=checked]`.
  An Accordion trigger shows open through `aria-expanded`, not a data attribute.
- Composition is `render={<Button />}`, never `asChild`.
- Popover, Select, Tooltip and Menu content sits in a `Positioner` that owns `side`, `align` and
  `sideOffset`; the `Popup` inside it takes the classes.

On the Radix `nova` style the same rows apply with `data-[state=…]` and `asChild`.

Replace `components/ui/button.tsx` with `references/button.tsx` outright. It keeps shadcn's variant and
size names working, so other shadcn components that call `buttonVariants()` still compile.

Every row also means: delete every `dark:` class, replace `focus-visible:ring-3 focus-visible:ring-ring/50
focus-visible:border-ring` with the Vetra ring (`focus-visible:shadow-ring-accent`, or the ring the
vetra-tokens focus tree gives), replace `disabled:opacity-50` (and `aria-disabled:` / `data-disabled:`)
with the disabled tokens, and add `motion-reduce:animate-none` beside every `animate-in` / `animate-out`.

**Weights.** A content row's title is Regular: a List Item label is read, not pressed. A control's
label is Medium: Button, Menu row, Accordion header, field Label, Tab, Dialog and Popover title.

| shadcn | Vetra | Replace | With |
| --- | --- | --- | --- |
| Card | Card, panel | `rounded-xl ring-1 ring-foreground/10`, `[--card-spacing:--spacing(4)]` | `rounded-12 border border-stroke-secondary`, `[--card-spacing:--spacing(5)]` |
| Input | Input Field, Medium | `h-8 rounded-lg px-2.5 bg-transparent` | `h-11 rounded-12 px-4 bg-background-b1 hover:border-stroke-primary` |
| | | `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` | `aria-invalid:border-red-stroke aria-invalid:shadow-ring-red` |
| | | `disabled:bg-input/50 disabled:opacity-50` | `disabled:bg-fill-secondary disabled:text-text-quaternary` |
| | | `placeholder:text-muted-foreground` | keep: it resolves to `text/secondary` |
| Label | Label | `leading-none`, `peer-disabled:opacity-50` and `group-data-[disabled=true]:opacity-50` | `text-text-primary` (`text-sm font-medium` stay; `text-sm` carries its 20 line height), `peer-disabled:text-text-tertiary group-data-[disabled=true]:text-text-tertiary` |
| Checkbox | Checkbox, Small | `rounded-[4px] border-input`, `data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground`, the indicator's `[&>svg]:size-3.5` | `rounded-4 border-stroke-primary bg-background-b2 text-on-color data-checked:border-accent-default data-checked:bg-accent-default data-checked:shadow-actions-primary focus-visible:shadow-ring-accent data-checked:focus-visible:shadow-ring-accent-on-color disabled:border-stroke-secondary disabled:bg-fill-secondary`, indicator `[&>svg]:size-3` (Medium: `size-5`, `[&>svg]:size-4`) |
| Select trigger | Select Field, Medium | the Input changes, and `data-[size=default]:h-8` | `data-[size=default]:h-11`, chevron `[&_svg]:text-gray-secondary` |
| Select content | Popover with Menu rows | `alignItemWithTrigger = true` | `alignItemWithTrigger = false`: the list hangs below the field, it never covers it |
| DropdownMenu, Select content | Popover with Menu rows | `rounded-lg ring-1 ring-foreground/10` | `rounded-12 border border-stroke-primary` (`bg-popover`, `shadow-md` and `p-1` are already right) |
| DropdownMenu, Select item | Menu row, Small | `rounded-md px-1.5 py-1 gap-1.5` (Select and checkbox items: `py-1 pr-8 pl-1.5`) | `min-h-9 rounded-8 px-3 gap-2 [&_svg]:text-gray-secondary` (keep `pr-8` where the check sits) |
| | | `data-disabled:opacity-50` | `data-disabled:text-text-tertiary data-disabled:[&_svg]:text-gray-tertiary` |
| | | `data-[variant=destructive]:text-destructive`, its `*:[svg]:text-destructive` and `focus:bg-destructive/10` | `data-[variant=destructive]:text-red-text`, `data-[variant=destructive]:[&_svg]:text-red-text`, keep `focus:bg-accent` |
| DropdownMenu, Select separator | Divider | `bg-border` | `bg-stroke-primary`: a menu divides with Stroke Primary, a list or table with Stroke Secondary |
| Dialog content | Dialog, 480px | `rounded-xl bg-popover p-4 gap-4 ring-1 ring-foreground/10 sm:max-w-sm` | `rounded-12 bg-background-b2 p-6 gap-5 shadow-lg sm:max-w-120` (`sm:max-w-160` for 640px, `sm:max-w-200` for 800px) |
| Dialog title | Dialog `Title` | `text-base leading-none` | `text-lg` (18/28, Medium stays) |
| Dialog header | Dialog `Title`, `Description`, `Close` | `flex flex-col gap-2`; description `text-muted-foreground` | a row `flex items-start gap-3`: a column `flex min-w-0 flex-1 flex-col gap-1` for title and description (`text-sm text-text-secondary`), then Close |
| Dialog close | Dialog `Close` | `showCloseButton`: `absolute top-2 right-2`, `size="icon-sm"` | pass `showCloseButton={false}` and put Close in the header row: `<DialogPrimitive.Close render={<Button variant="ghost" size="small" icon aria-label="Close" className="-my-1 -mr-2.5" />}><X /></DialogPrimitive.Close>`. The 36 box sits on the 28 title line, and `-mr-2.5` puts the 16 glyph on the content edge |
| Dialog footer | Dialog `Actions` | `-mx-4 -mb-4 flex-col-reverse rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end` | `flex items-center gap-2`, no band: a `flex-1` cell at the left holds `Tertiary` (Ghost), then `Secondary` (Outline) and `Primary`, Small, Primary last |
| Popover content | Popover | `w-72 gap-2.5 rounded-lg p-2.5 ring-1 ring-foreground/10` | `w-64 gap-0 rounded-12 p-1 border border-stroke-primary` (`w-80`, `w-100`, `w-120` for 320, 400, 480); `bg-popover` and `shadow-md` are already right |
| | | the Positioner's `sideOffset = 4`, `align = "center"` | `sideOffset = 8`, `align` on the trigger's outer edge (`"end"` for a trigger at the right). A trigger inset in a bar hangs 8 below the bar: `sideOffset` = 8 + the inset (16 in the kit's toolbar) |
| Popover header | Popover `Header` | `PopoverHeader` `flex flex-col gap-0.5 text-sm`; there is no Close | `flex items-start gap-3 px-3 pt-3 pb-2`; `PopoverTitle` `min-w-0 flex-1 text-sm font-medium text-text-primary`; Close is `<PopoverPrimitive.Close render={<Button variant="ghost" size="tiny" icon aria-label="Close" className="-my-1 -mr-2" />}><X /></PopoverPrimitive.Close>` (12 glyph) |
| Popover footer | Popover `Footer` | none in shadcn | a `Separator` `bg-stroke-primary` in `px-3 py-2`, then `flex justify-end gap-2 px-3 pt-1 pb-2` holding `Secondary` (Outline) and `Primary`, Small |
| Accordion | Accordion Item, stacked | the item's `not-last:border-b` | no border on the item: a `Separator` between items, `mx-3 my-1 bg-stroke-secondary`, in a container padded 4 (`p-1`) |
| Accordion trigger | Accordion Item header, Medium | `items-start rounded-lg border border-transparent py-2.5 text-sm font-medium hover:underline`, `focus-visible:after:border-ring`, `aria-disabled:opacity-50` | `items-center gap-3 rounded-8 px-3 py-2.5 text-base font-medium text-text-primary hover:bg-fill-tertiary focus-visible:bg-background-b1 focus-visible:shadow-ring-accent aria-disabled:text-text-tertiary` (Small: `py-2 text-sm`). No border: it would make the row 46, not 44 |
| | | the chevrons' `**:data-[slot=accordion-trigger-icon]:size-4` and `:text-muted-foreground` | `size-5` (Small `size-4`) and `text-gray-secondary`, plus `group-hover/accordion-trigger:text-gray-primary` on each icon. Keep both chevrons: they already swap on `aria-expanded` |
| | | `AccordionPrimitive.Header` (an `h3`) | `render={<h4 />}` or whatever sits one level below the heading that names the group |
| Accordion content | Accordion Item `Content` | the inner div's `pt-0 pb-2.5` | `px-3 pb-3` (Small `pb-2`); with a leading icon, indent past it (`pl-11` Medium, `pl-10` Small). Keep `h-(--accordion-panel-height)` and the `data-starting-style:h-0 data-ending-style:h-0` classes: they run the open and close |
| Item (`item`) | List Item | the `variant` axis, and `flex-wrap rounded-lg border`, `[a]:hover:bg-muted`, the focus ring | delete them: a List Item is static, with no border, fill, hover or focus. A row that does something on click is a Menu row |
| | | the `size` axis (`default`, `sm`, `xs`: `gap-2.5 px-3 py-2.5`) | Vetra's `Size` × `Content`, all `gap-3 px-3`, no vertical padding: `h-11` Medium, `h-16` Medium two lines, `h-9` Small, `h-13` Small two lines |
| | | `ItemTitle` `line-clamp-1 w-fit gap-2 text-sm leading-snug font-medium` | `truncate text-base text-text-primary` (Small `text-sm`), Regular: drop `font-medium` |
| | | `ItemDescription` `line-clamp-2 text-sm leading-normal text-muted-foreground` | `truncate text-sm text-text-secondary`; drop `leading-normal`, it overrides the step's 20 |
| | | `ItemContent` `gap-1`; `ItemGroup` `gap-4` | `min-w-0 gap-0`; `gap-0`: rows touch and Separators divide them |
| | | `ItemSeparator` `my-2` | `mx-3 my-1 bg-stroke-secondary` with `role="presentation"`: a `role="list"` may own only list items, so a separator role inside it fails axe |
| | | `ItemMedia` `icon` variant `size-4`, `image` variant | icon `size-5` (Small `size-4`) `text-gray-secondary`; an image is an Avatar |
| Kbd | Kbd | `h-5 min-w-5 rounded-sm px-1 bg-muted text-muted-foreground font-sans`, and every `in-data-[slot=tooltip-content]:` class | a `cva` `size`: `small` (default) `h-6 min-w-6 rounded-8 px-1.5 text-sm`, `tiny` `h-5 min-w-5 rounded-6 px-1 text-xs`; base `border border-stroke-primary bg-background-b2 text-text-secondary`. The tooltip classes paint the key in `background` for shadcn's dark tooltip; on Vetra's light one it vanishes |
| | | `KbdGroup` renders a `<kbd>` | a `<span>` (`inline-flex items-center gap-1`): a chord is caps side by side, not a key inside a key |
| Skeleton | Skeleton | `animate-pulse rounded-md bg-muted` | `motion-safe:animate-pulse bg-fill-secondary`; a text line `rounded-full h-3` in an `h-6` box for `text-base` (`h-2` in `h-4` for `text-xs`, `h-2.5` in `h-5` for `text-sm`, `h-4` in `h-7` for `text-lg`), so `type=line` needs a wrapper div; an avatar `rounded-full size-8`, a block `rounded-8` |
| Dialog overlay | `overlay/scrim` | `bg-black/10 supports-backdrop-filter:backdrop-blur-xs` | `bg-overlay-scrim` |
| Tooltip | Tooltip | `rounded-md bg-foreground text-background px-3 py-1.5 text-xs max-w-xs` | `rounded-10 border border-stroke-primary bg-background-b2 text-text-primary shadow-md px-3 py-1.5 text-sm max-w-60` (the label wraps at 216) |
| | | the `TooltipPrimitive.Arrow` element | delete it: the kit's tooltip has no arrow in code |
| | | the Positioner's `sideOffset = 4`; the provider's `delay = 0` | `sideOffset = 8`; a `delay` of about 300, so passing the pointer along a toolbar doesn't flash every label |
| Tabs, default variant | Segmented Control | list `rounded-lg p-[3px] bg-muted h-8` | list `rounded-10 p-0 bg-fill-tertiary h-9` |
| | | trigger `rounded-md text-foreground/60 data-active:bg-background data-active:shadow-sm` | trigger `rounded-10 border text-text-secondary hover:bg-fill-secondary data-active:bg-background-b2 data-active:border-stroke-secondary data-active:text-text-primary data-active:shadow-actions-secondary` |
| Tabs, `line` variant | Tabs, Underline | trigger `text-foreground/60`, the underline `after:bg-foreground` | trigger `text-text-secondary data-active:text-accent-text`, `after:bg-accent-default` |
| Badge | Badge | the variants | see below |
| Avatar | Avatar | `after:border … mix-blend-*`; `data-[size=lg]:size-10` | delete the overlay; `size-12` (Vetra 24 / 32 / 48); fallback `bg-accent-fill border border-accent-stroke text-accent-text font-semibold`, or the `{fam}` of the Figma `Color` (Neutral: `bg-fill-tertiary border-stroke-secondary text-text-primary`) |
| Progress | Progress | track `bg-muted`, indicator `bg-primary` | track `bg-fill-secondary`, indicator `rounded-full bg-accent-text` |
| Card | Card, panel | `--card-spacing` | a panel that pads its own sections: `gap-0 py-0` |

**Badge.** Replace shadcn's variants with Vetra's three styles, `rounded-8 h-6 px-2 text-xs font-medium`
for Small:

- Tinted: `border bg-{fam}-fill border-{fam}-stroke text-{fam}-text`; Neutral:
  `border bg-fill-tertiary border-stroke-secondary text-text-primary`
- Filled: `border-transparent bg-{fam}-default text-on-color`; Neutral: `bg-gray-secondary text-on-color`
- Ghost: `border-transparent px-0 text-{fam}-text`; Neutral: `text-text-primary`

`{fam}` is one of accent, red, orange, brown, yellow, lime, green, sky, violet, pink, or the name a
rebrand gave it. `families.ts` has every class written out. Write each class out in full: Tailwind only generates classes it can read in the source, so a template string such as
`` `bg-${color}-fill` `` never compiles.

**Kbd for screen readers.** Give Kbd a `label` and a glyph map (`⌘` Command, `⇧` Shift, `⌥` Option,
`⌃` Control, `↵` Enter, `⌫` Backspace, the arrows, `Esc` Escape). Render the glyph `aria-hidden` and
the word in an `sr-only` span, so a chord reads "Command K".
