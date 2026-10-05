# Component inventory

Every public component in Vetra UI 1.0, with its properties as the Figma file names them. Defaults
are marked `(default)` or `on` / `off`. `↗ Hint` is the hint beside a field's label and `↓ Hint`
the hint under the field.

Every icon slot defaults to a square placeholder glyph, and every text property ships placeholder
copy ("Label", "Hint text", "Input text"): replace both or turn the slot off.

## Actions

**Button**: a labelled action.
- `Size` Large 52, Medium 44, Small 36, Tiny 28. `Style` Primary, Fill, Outline, Ghost.
  `Tone` Default, Destructive, Neutral (Neutral exists on Fill only). `State` Default, Hover,
  Focused, Disabled, Active.
- `Label`; `Left Icon`, `Right Icon`, `Counter` all off.
- Horizontal padding 20 / 16 / 12 / 8; height fixed, content centered.

**Icon Button**: a square button with one icon; pair it with a Tooltip.
- Same `Size`, `Style`, `Tone`, `State` as Button, so the two line up in a toolbar.
- Icon 24 / 20 / 16 / 12. `Icon` swaps the glyph.
- `Counter` off. On, it puts a Counter on the icon's top-right corner, inside the box (the focus ring
  needs the box to clip): Medium on Large and Medium, Small on Small and Tiny, Neutral Filled until
  you set its `Color`. Keep it to two digits on Small and Tiny, or switch the Counter to Dot.

**Button Group**: two to five joined buttons acting as one control: a view switch, a set of toggles.
No selected state, and every item is Label or Icon, never both: a split action is one Button with a
chevron that opens a Menu.
- `Size` Tiny, Small, Medium, Large. `Style` Primary, Fill, Outline, Ghost. `Items` 2–5.
  `Content` Label, Icon.
- The dividers between items belong to the group. A Ghost group keeps all four corners on every
  item, because a ghost group is independent buttons, not one shape.

**Link**: a text link that navigates.
- `Size` Large, Medium, Small, Tiny. `Style` Inline (in a sentence, underlined at rest),
  Standalone (in UI chrome, underlined on hover). `Tone` Default (accent), Neutral (body color).
  `State` Default, Hover, Focused, Disabled.
- Single line. The underline is the hover signal; weight never changes, so text never reflows.
- Icons take the label's ink (`accent/text` on Default). Never repaint a Link icon `accent/default`:
  it measures 3.29:1 in light where the label reads 5.83.

## Selection

**Checkbox**: select any number; stages a change until something is submitted.
- `Size` Medium, Small. `Checked` Unchecked, Checked, Indeterminate. `State` Default, Hover,
  Focused, Disabled.
- `Label` and `Hint Text` off: the bare box is for table and menu rows. Turn both on for a form row.

**Radio Button**: one choice from a visible set.
- `Size` Medium, Small. `Selected` Deselected, Selected. `State` as Checkbox.
- `Label` and `Hint Text` off by default, same reason as Checkbox.

**Switch**: an on/off setting that takes effect immediately.
- `Size` Medium, Small. `On` Off, On. `State` as Checkbox.
- `Label` and `Hint Text` off by default.

**Segmented Control**: exactly one of 2–5 short options on, switching views of the same thing.
- `Size` Large, Medium, Small, Tiny. `Item 3` on, `Item 4`, `Item 5` off.
- The active segment is set on the nested segment (see Nested parts).

**Tabs**: sections of one panel or page.
- `Size` Large, Medium, Small, Tiny. `Style` Underline, Pills. `Tab 3` on, `Tab 4`, `Tab 5` off.
- The active tab is set on the nested tab.

**Select Field**: one choice from a long list.
- `Size` Large 52, Medium 44, Small 36. `Value` Empty (shows `Placeholder`), Filled (shows
  `Selected`). `State` Default, Hover, Focused, Error, Disabled.
- `Label` and `↓ Hint` on; `↗ Hint`, `↗ Icon`, `Left Add-on` off. 320 wide as shipped: set it to
  fill its container in a form.
- The open list is not part of the field: compose Menu rows under it (SKILL.md, Compose, Menu row).

**Multiselect Field**: several choices from a long list, shown as chips.
- `Size`, `Value`, `State` as Select Field. `Chip 1`, `Chip 2` on, `Chip 3` off; each chip is a Badge.

**Calendar**: a month grid.
- `Type` Day Picker, Range Picker, Month Picker. 324 wide.
- Days are set on the nested cells: selection, range ends, today.

**Date Tile**: one day as a pressable tile, weekday over date, for a week strip, a booking picker or
a schedule header. A month grid is Calendar.
- `Size` Medium 64 × 72, Small 40 × 52. `Selected` Off, On (accent, like a selected Calendar day).
  `State` Default, Hover, Focused, Disabled (a day that can't be picked).
- `Weekday` ("Wed"), `Date` ("28"), `Today` off: a 1px accent ring and a dot under the date; on a
  selected tile only the dot.
- A week strip is seven tiles in a row, 8 apart or spread across a card; one tile Selected, the
  current day marked as today, unavailable days Disabled.

**Slider**: a value, or a range with two knobs, on a track.
- `Knobs` One, Two. `Percent` 0, 25, 50, 75, 100. `State` Default, Hover, Focused, Disabled.
- `Discrete` adds ticks and only takes quarter values. `Tooltip` and `Tooltip 2` show each knob's
  value. 220 wide as shipped: set it to fill.

## Text entry

**Input Field**: one line of text.
- `Size` Large, Medium, Small. `Value` Empty, Filled. `State` Default, Hover, Focused, Error,
  Disabled. `Style` Outline, Ghost.
- `Label` and `↓ Hint` on. `Left Add-on`, `Right Add-on`, `Button` off.
- Ghost has no fill, border or ring, for a field inside a surface that already draws the edge: a
  command palette's search row, a chat bar, an inline rename, an edited table cell. It ships in
  Default, Focused and Disabled only; set State before switching Style.
- A long value ends in an ellipsis in every state but Focused.

**Text Area**: several lines of text.
- `Size`, `Value`, `State` as Input Field. `Row 3` on, `Row 4`–`Row 6` off: the minimum height in
  rows. The box grows with its text.
- `Count` off (a character counter); `Resizer` on.

**Number Field**: a number.
- `Size` Large, Medium, Small. `Stepper` None, Stacked (chevrons), Split (minus and plus
  buttons). `State` Default, Hover, Focused, Error, Disabled.
- The field hugs its digits, 64–184 wide, inside a 200-wide root that keeps the label's width. A
  short field under a full-width label is correct.

**OTP Input**: a one-time code.
- `Length` 4, 6, 8. `Size` Large, Medium, Small (per box). `State` Default, Error, Disabled.
- Digits and the focused box are set on the nested boxes.

**Input add-ons**: prefixes and suffixes on Input, Select and Multiselect fields, on the nested
`x-Base/Input Field/Add-on`. `Type` Label, Label Inline, Select, Select Country, Icon,
Icon Inline, Payment, Badge, Clear. Text such as `https://`, `$` or `+1` is `Label Inline`,
not an icon. A shortcut hint (⌘K) is the `Badge` add-on with its nested Badge swapped to Kbd.

## Status and feedback

**Badge**: a short status or category label. Not interactive.
- `Size` Tiny 20, Small 24, Medium 28, Large 32. `Style` Tinted (default), Filled, Ghost.
  `Color` Neutral, Accent, Green, Yellow, Orange, Red, Violet, Sky, Pink, Lime, Brown.
- `Left Icon`, `Right Icon`, `Image` off. Tiny's 10px label is for counts; use Small wherever the
  label is read. A keyboard key is a Kbd, not a Badge.

**Event Chip**: one event in a schedule column, a week view or an agenda. Static, like Badge.
- `Color` as Badge, Neutral default, on the Tinted recipe; the title stays `text/primary`. Color by
  meaning (Accent the next event, Yellow waiting on a reply, Red a conflict) or by calendar.
- `Title` (14 medium, two lines, then an ellipsis), `Time` (12 medium, one line), `Mode` on
  (`↳ Mode`: video, phone, map-pin, users), `Status` off (`↳ Status`, `↳ Status Icon`:
  circle-check, clock, triangle-alert, circle-x).
- Set the instance to Fill its column, 120 or wider; the height hugs. In code it is the button or
  link that opens the event.

**Kbd**: a key cap for a keyboard shortcut. Static, never pressed.
- `Size` Small 24 (14px), Tiny 20 (12px). The heights match Badge's. `Label` holds the key as text: ⌘ ⇧ ⌥ ⌃
  ↵ Esc. One key is square; a longer label grows.
- A chord is one cap per key in a row at gap 4 (`⌘` `K`); a menu row short on room may put the whole
  chord in one cap. Tiny in a menu row, a palette footer or a line of 14px text; Small in a shortcut
  list.

**Counter**: a count riding on another control.
- `Size` Medium 20 (on Small, Medium and Large hosts), Small 16 (on Tiny hosts). `Style` Filled,
  Tinted, Dot. `Color` as Badge.
- The Dot style is a mark with no number, for "new" or "unread" when the count doesn't matter: 8px on
  Medium, 6px on Small, in the Filled color. There is no tinted dot.
- Turn it on through the host's `Counter` property (Button, Icon Button, Tab, Segment); it is not
  placed loose beside a control. A sidebar row's count or dot is a Menu right add-on or a Counter
  in the row, never a hand-drawn circle.

**Icon Badge**: one icon in a colored container. Decorative.
- `Size` 16, 24, 32, 48, 64, 96. `Style` Tinted, Filled. `Color` as Badge.

**Progress**: how far a task has run. An output: never focusable, no states.
- `Type` Line, Circular. `Value` 0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100,
  Indeterminate. `Size` Large, Medium, Small, Tiny.
- `Label` and `Value Text` off. Label the bar with the value it draws.
- In Figma a value between the steps goes through the grow weights on a Line: 68% is `Fill`
  `layoutGrow` 68 and `Trail` 32. Resizing `Fill` does nothing. Circular has no such trick: round
  to the nearest step and label it with that step.

**Skeleton**: a loading placeholder in `fill/secondary`. Static in Figma.
- `Type` Line, Circle, Block. `Size` Large, Medium, Small, Tiny: a Line's box is the line height of
  text-lg, text-base, text-sm or text-xs (28, 24, 20, 16) around a 16, 12, 10 or 8 bar; a Circle is
  Avatar's 48, 32, 24 or 16. Block ships at Large only, 256×128 with `radius-8`; resize it and give it
  the radius of what it replaces.
- Mirror the layout that will load: the same Avatar size, one Line per line of text at its text
  step, Lines set to Fill with the last one of a paragraph cut to about 60%. Keep the real chrome
  (card, header, title) and skeleton only the data.

**Rating**: a read-only star score.
- `Rating` 0–5 in halves. `Size` Large, Medium, Small, Tiny. `Score`, `Count` off.

**Alert**: an in-page notice.
- `Type` Info, Warning, Error, Success. `Size` Medium, Small.
- `Message` always shown. `Title`, `Actions`, `Action 2`, `Dismiss` off. The status icon comes with
  `Type` and can't be turned off: status is carried by hue, glyph and words together.

**Alert Dialog**: a modal that stops the flow for a decision.
- `Tone` Default, Destructive (the confirm button turns red). 400 wide.
- `Icon` and `Cancel` on, `Tertiary` off. Actions are Small Buttons: confirm Primary, cancel
  Outline, the optional third Ghost. Place it over `overlay/scrim`.
- The confirm always shows and is always Primary. A form, or a notice with one acknowledging
  button, is a Dialog.

**Dialog**: a modal for a form or a notice, anything that needs more than a yes or no.
- `Size` 480px (default), 640px, 800px (a dialog with its own nav column). Place it over
  `overlay/scrim`.
- `Title` "Invite teammates". `Description` on, with `↳ Description`. `Close` on (a Small Ghost
  Icon Button on the title line).
- `Content` on: `↳ Content` swaps in a component of your own (default `x-Base/Slot`, a
  placeholder). Build the body as an auto-layout component that hugs its height; it fills the
  width. Turn `Content` off when the description says it all.
- `Actions` on: `Secondary` (Outline) and `Primary` on, `Tertiary` (Ghost, at the left) off. They
  are exposed Small Buttons, so set each label and Tone on the nested button. For a notice, turn
  `Primary` off and keep one Outline "Close".
- The swapped component fills the width when its own width carries no variable: a bound width wins
  over Fill and snaps it back to that width.

**Popover**: a floating container for a menu, a picker or a short form. Hangs 8 below its trigger,
aligned to the trigger's outer edge.
- `Size` 256px (default), 320px, 400px, 480px. Menus take 256 or 320, a form 480.
- `Content` swaps in a component of your own (default `x-Base/Slot`). Menu rows go in as they are,
  2 apart; a form body pads 4/12/12/12 so its fields line up with the title at 16.
- `Header` off; on, it shows `↳ Title` and `Close` (on). `Footer` off; on, it adds a divider and
  Small Buttons, `Secondary` (Outline, on) and Primary at the right, both exposed.
- As on Dialog, leave the swapped component's width unbound.

**Tooltip**: a short label for a control, on hover or focus.
- `Placement` Top, Right, Bottom, Left, None (arrow side). `Hint Text` off (a second line).
- A label only. Anything with a link or a button is a Popover.
- The label wraps at 216, so the bubble tops out near 240. Keep it to one line, about 32 characters.

## Navigation

**Breadcrumbs**: the path to the current page.
- `Size` Large, Medium, Small, Tiny. `Divider` Chevron, Slash. The first crumb and `Current` always
  show; `Crumb 2`, `Crumb 3` (on) and `Crumb 4` (off) add middle crumbs, so a two-level trail turns
  Crumb 2 and Crumb 3 off. An `Ellipsis` crumb collapses a long middle.
- Each crumb's text is `Label` on its nested `x-Base/Breadcrumbs/Item` (defaults "Home", "Projects",
  "Breadcrumbs": replace every one); the first Item also has an `Icon` switch.
- A crumb caps at 200 (`sizing-200`) and ends in an ellipsis; short crumbs hug. Don't widen or
  fill a crumb to fit a long title: the cap is what keeps the path from stretching.

**Pagination**: page controls for a long list.
- `Type` Numbers, Compact (a range line instead of numbers). `Size` Large, Medium, Small, Tiny.
- On the first page set Previous to Disabled, on the last page Next; the row keeps its width.

**Menu**: one row of a menu or list. Stack rows in a component and swap it into a Popover's
Content.
- `Size` Medium 44, Small 36 (one line); `Content` One Line, Two Line (64, 52 with a subtitle),
  Multi Line. `Selected` Off, On. `State` Default, Hover, Active, Focused, Disabled. `Right Add-on`
  on.
- The row's content lives on the nested left and right parts. On One Line and Two Line the label
  and subtitle are one line each and end in an ellipsis; a longer label needs a wider menu. Multi
  Line is for a row that has to explain itself (a destructive action and its consequence): label
  and subtitle wrap to two lines each, and the row hugs with 10 above and below (8 on Small).
- The parts' `Tone` follows the row: Hover on a Hover or Active row (icons step to `gray/primary`,
  because `gray/secondary` on the hover wash is 2.66:1 in dark), Selected on a selected row,
  Disabled on a disabled one. Changing a part's `Type` keeps the Tone it had, so set the row's
  `State` first, then the part's `Type`, then check its `Tone`.
- A fill or color you override on a row is dropped when its `State` or `Selected` changes; re-apply
  it after every variant change. Prefer the part's `Tone` to `iconColor` on a menu row.
- A left part showing an avatar nests an Avatar that defaults to Name (initials): set its
  `Initials`, or switch it to Image for a photo.

**Carousel**: the position controls of a carousel, not its slides.
- `Type` Dots, Bars, Counter. `Dot 3`–`Dot 8` set the count; past 8, use Counter. `Controls` off
  (a previous and next pair of Medium Outline Icon Buttons).

## People and data

**Avatar**: a person or entity. Not interactive.
- `Size` Large 48, Medium 32, Small 24, Tiny 16. `Type` Placeholder, Image, Name, Icon.
- `Color` Accent (default), Green, Yellow, Orange, Red, Violet, Sky, Pink, Lime, Brown, Neutral.
  It exists on Name and Icon, tinted like a Tinted Badge. Give one person or agent one color everywhere
  it appears; don't override the fills by hand.
- `Initials` takes two letters from 24 up and one letter at 16. `Status` off; the dot starts at
  Small.

**Avatar (Grouped)**: an overlapping pile of two to five avatars, with an optional +N.
- `Size` as Avatar. `Overflow` Off, On. `Avatar 3` on, `Avatar 4`, `Avatar 5` off.
- Each face is ringed in `background/b1`: place a pile on `b0` or `b1`. On `b2` and `b3` the ring
  shows as a gray halo.

**Table (Header)**: a column header. `Type` Text, Checkbox (select all), Space. `Size` Medium 44,
Small 36. `Icon` (sort chevron) on. `Align` Left (default), Right, on Text only: Right puts the
title on the right edge and the chevron before it.

**Table (Cell)**: one body cell. `Size` Medium 64, Small 52. `Type` Text, Badge + Small Text,
Badge, Status, Icon, Checkbox, Radio Button, Switch, Image + Text, Icon + Text, Avatar +
Text, Payment + Text, Users, Progress, Button, Icon Button. Build a column by stacking cells of
one Type under a header of the matching size. `Align` Left (default), Right, on Text only:
right-align a number column (amounts, sizes, counts), set its cells to Fill the column, and set
its header to Right too.

**List Item**: a static row of content in a list or a card. Not a target: its Button and Checkbox
are.
- `Size` Medium, Small. `Content` One Line (44, 36), Two Line (64, 52 with `Subtitle`). Label and
  subtitle are one line each and end in an ellipsis.
- `Leading` None (default), Icon (`Icon` swaps the glyph), Icon Badge, Avatar, Checkbox. The last
  three are exposed: set the badge's `Icon` and `Color`, the avatar's initials or photo, or `Checked`
  on the nested instance.
- After the text: `Value` on (`↳ Value`, `text/secondary`), `Badge`, `Button` (Tiny Outline) and
  `Icon Button` (Tiny Ghost, an ellipsis) off. All three are exposed: set the label, Color or icon on
  the nested instance.
- Padding is 12 at the sides, like a Menu row: stack rows in a container padded 4 (a Card or a
  Popover) and split them with Divider `Stroke` Secondary.
- A row that navigates or runs something on click is a Menu row; a row that expands is an Accordion
  Item.

**Accordion Item**: a row that opens in place to show more.
- `Size` Medium, Small. `Open` Off, On (the chevron points down, then up). `State` Default, Hover,
  Focused, Disabled.
- `Title` wraps; the header hugs, 44 closed on Medium and 36 on Small. `Icon` off (`↳ Icon`),
  `Subtitle` off (`↳ Subtitle`).
- `Content` swaps in a component of your own (default `x-Base/Slot`), shown when Open is On. Build it
  as an auto-layout component that hugs its height with its width unbound; it fills the row and
  lines up with the title, indented past the glyph when the icon shows.
- Stack items in a container padded 4 and split them with Divider `Stroke` Secondary. Open one item
  at a time in a FAQ; settings groups may open several.

**Checklist Item**: one item of a readiness or setup list. Static: only its Button is a target.
- `State` Done (green disc, check), Current (accent ring), Upcoming (gray ring), Failed (red disc,
  cross): Multistepper's markers, without numbers.
- `Label` (14 medium, wraps), `Description` on (`↳ Description`, 12 regular `text/secondary`),
  `Action` off: a Tiny Outline Button, exposed, for the item to act on next, labelled with a verb.
- Stack items in a card padded 4 under a header with the count ("2 of 4 done"). A numbered plan is a
  Multistepper; a live agent run is Agent Steps.

**Divider**: a rule between groups.
- `Orientation` Horizontal, Vertical. `Type` Line, Label, Title, Icon, Badge, Button,
  Button Group. `Align` Center, Start, End. `Stroke` Primary (default, `stroke/primary`),
  Secondary (`stroke/secondary`).
- Primary separates sections and groups; Secondary is the rule between rows of a list or table.

## Charts

These two live on the Charts page. The chart cards there are built from its plots (`Area Chart/*`,
`Bar Chart/*` and the rest), `Chart Tooltip`, and the page's own parts: `x-Base/Chart/Header Text`,
`x-Base/Chart/X Ticks`, `x-Base/Chart/Horizontal Lines`, `x-Base/Chart/Vertical Lines`,
`x-Base/Chart/Grid`. Clone a card rather than assembling one from parts.

**Legend**: names one chart series: a swatch, a label and an optional value. Static.
- `Shape` Dot (default: area, pie and radar), Square (bars), Line (a line series). `Color` Accent,
  Orange, Pink, Violet, Yellow, Neutral: the chart series order, with Neutral (`gray/secondary`)
  for a muted or comparison series such as last year.
- `Label` (12 regular, `text/primary`), `Value` off (`↳ Value`, 12 mono medium, 8 right of the
  label). 24 tall.
- A row of legends sits at gap 16 under the plot. In a column, set each instance to Fill: the value
  moves to the right edge and the figures line up.

**Sparkline**: a trend at a glance beside a number. Static, no axes.
- `Size` Medium 128×32 (a KPI card), Small 64×24 (a table cell). `Trend` Up, Down, Flat, Volatile:
  sample shapes, redraw the line when the real series matters. `Color` as Legend.
- `Dot` on (the latest point; turn it off down a table column), `Area` off (fills under the line
  in `{fam}/stroke`).
- The line is 2px (`stroke-2`) at both sizes. The width can stretch; keep the height. The color
  names the series; a good or bad verdict goes in a Badge beside it.

## Nested parts

Some state lives on a nested part, not on the component. In code these are the component's value
props (the selected tab, the current page); in Figma, set them on the nested instance.

| Set this | On the nested part | Property |
| --- | --- | --- |
| The active tab | `x-Base/Tabs/Tab` | `Active` On |
| The active segment | `x-Base/Segmented Control/Segment` | `Active` On |
| The current page | `x-Base/Pagination/Page number` | `Current` On |
| A selected day, a range, today | `x-Base/Calendar/Cell` | `Selection`, `Today`, `State` Inactive for other months |
| The weekday headers | `x-Base/Calendar/Weekday` | `Label`, one or two letters |
| The current crumb, a collapsed middle | `x-Base/Breadcrumbs/Item` | `Type` Current, Ellipsis |
| A menu row's content | `x-Base/Menu/Left`, `x-Base/Menu/Right` | `Type`, `Tone` Hover, Selected, Disabled |
| A digit, the focused box | `x-Base/OTP Input/Box` | `Digit`, `Value`, `State` Focused |
| A field's prefix or suffix | `x-Base/Input Field/Add-on` | `Type`, `Side` |
| The carousel's position | `x-Base/Carousel/Indicator` | `Active` On |

`x-Base/Menu/Left` `Type`: Label, Icon, Icon Badge, Avatar, Image, Image (Round), Checkbox,
Radio Button, Switcher, Payment. `x-Base/Menu/Right` `Type`: Small Text, Text, Small Text + Icon,
Text + Icon, Icon, Small Icon, Double Icon, Badge, Counter, Counter + Icon, Button,
Checkbox, Radio Button, Switcher.
