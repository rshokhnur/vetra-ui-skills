---
name: vetra-components
description: Chooses the right Vetra UI component and its properties (style, tone, size, color, state) for any interface need, and composes components into menus, popovers, dialogs, forms, tables, toolbars and cards the way the kit's own screens do. Use when building, editing or reviewing a screen or flow with the Vetra UI kit, in Figma or in code, whenever you decide which control to use, how emphatic it is, how big it is, or how pieces fit together, including every use_figma write to a file built on Vetra UI, even when a brief only names the kit. Use vetra-tokens alongside it for every color, spacing and type value.
---

# Vetra UI components

Read the `vetra-ui` skill first (`../vetra-ui/SKILL.md`): it routes the task and holds the rules
that override this one, including the team's recorded changes to the kit.

Every component's property, default and nested part is in
`references/inventory.md`; colors, spacing and type come from `vetra-tokens`.

## Rules that override everything below

1. **Use the kit's component when one exists.** In Figma place an instance; in code build or reuse
   the one component that maps to it. Never redraw a control from rectangles and text. Why: a
   redrawn control loses its states, its tokens and every later fix to the master.
2. **One Primary per view.** Every other action is Outline, Fill or Ghost; two primaries leave no
   clear next step. Sample content inside a preview, such as a template or a mock screen, uses
   Outline too, so the view keeps its one Primary. A page under `overlay/scrim` doesn't count: the
   dialog on top is the view. An empty state whose action repeats the header's Primary shows it as
   Outline, or leaves it out.
3. **Style is emphasis, Tone is intent. Set them separately.** A destructive action stays
   quiet: Delete in a settings footer is Outline + Destructive, a trash icon in a row is Ghost +
   Destructive. Primary + Destructive is only the confirm button of a destructive Alert Dialog.
   Declining ("Deny refund", "Don't deploy") destroys nothing, so it is Outline with Tone Default.
4. **Controls in one row share one size.** A field and the button beside it are the same height.
5. **No placeholder ships.** The square glyph in an icon slot and the copy "Label", "Button",
   "Input text", "Hint text" are placeholders. Replace them or turn the slot off.
6. **The file decides which components exist.** This skill describes Vetra UI 1.0. When a component
   or property named here is missing from the team's file, use the file's closest component and say
   so, or stop and report it; never redraw it from shapes. When the file has a component or property
   this skill doesn't list, read its description and use it; the team's own components come first
   wherever the kit has none. When a team component and a kit component do the same job (a team "New
   dot" and Counter `Style` Dot), use the one the project's `## Changes to Vetra UI` names; with no
   line there, keep the team's on screens that already use it and ask which to use for new work. Why: the tree is a snapshot, and the file is what the build links to.

A person's request wins: build what they asked. Suggest the kit's way once, in one sentence in total,
and never refuse.

## Pick the component

Take the first branch that matches what the person does.

```
Act
├── with a text label ─────────────────────────────── Button
├── icon only: toolbar, table row, card corner ────── Icon Button, with a Tooltip naming it
├── go to another page or document ────────────────── Link: Inline in a sentence, Standalone in UI
├── joined actions: a view switch ────────────────── Button Group
├── a main action plus a menu of related ones ─────── one Button with a chevron Right Icon that opens a
│                                                     Menu; Button Group can't mix a label and an icon
└── a main action and a separate menu of other creates ─ the Primary for the main action; an Outline
                                                      Button with a chevron Right Icon to its left opens
                                                      the Menu, which hangs 8 below it, aligned to the
                                                      trigger's outer edge. The open trigger stays Default

Choose one
├── 2–5 short options that change a view in place ─── Segmented Control
├── sections of a panel or page ───────────────────── Tabs
├── 2–5 options in a form, compared side by side ──── Radio Button, Label on
├── from a longer list, or where space is short ───── Select Field, its list as Menu rows
├── a date, a range, a month ──────────────────────── Calendar, Type = that job
└── a day in a week strip or a booking row ────────── Date Tile, one per day

Choose several
├── a few, all visible ────────────────────────────── Checkbox, Label on
├── from a longer list ────────────────────────────── Multiselect Field
└── toggle chips, such as weekdays ────────────────── Button Fill: selected Tone Default, the rest Tone Neutral

Mark one answer as chosen, such as right or wrong ─── Segmented Control, or the toggle chips above.
Never Button Group State Active: that is the pressed state, and a chosen answer looks mid-click.

Turn something on or off
├── it takes effect now ───────────────────────────── Switch
└── it takes effect on submit ─────────────────────── Checkbox

Enter
├── one line ──────────────────────────────────────── Input Field
├── several lines ─────────────────────────────────── Text Area
├── a number ──────────────────────────────────────── Number Field
├── a one-time code ───────────────────────────────── OTP Input
└── a value on a range ────────────────────────────── Slider

Pick from a list of actions or places: overflow ⋯, account, context menu
└── Menu rows in a Popover, see Compose

Read a status
├── a state or a category ─────────────────────────── Badge
├── a count on a control ──────────────────────────── Counter, through the host's Counter property
├── "new" or "unread" with no number ──────────────── Counter, Style Dot
├── a decorative icon in a colored box ────────────── Icon Badge
├── progress of a task ────────────────────────────── Progress; Indeterminate when the end is unknown
├── content still loading, in the shape it will take ─ Skeleton, inside the real chrome
├── a readiness or setup list: done, next, to do,
│   failed ─────────────────────────────────────────── Checklist Item
├── a keyboard key or shortcut ────────────────────── Kbd, one cap per key
└── a score ───────────────────────────────────────── Rating

Be told something
├── about this page, until dismissed ──────────────── Alert, Type = the status
├── a decision that must happen before going on ───── Alert Dialog
├── a form or a task over the page ───────────────── Dialog
├── a notice that needs only an acknowledgement ───── Dialog with Primary off and one Outline
│                                                     "Close"; Alert Dialog always shows a
│                                                     Primary confirm
└── what an icon control does ─────────────────────── Tooltip

Find the way
├── where you are in a hierarchy ──────────────────── Breadcrumbs, the last crumb Current
├── the pages of a long list ──────────────────────── Pagination: Numbers, or Compact when narrow
└── the position in a carousel ────────────────────── Carousel: Dots up to 8, Counter beyond

People and data
├── a person or an entity ─────────────────────────── Avatar; several → Avatar (Grouped)
├── records in rows and columns ───────────────────── Table (Header) + Table (Cell)
├── a content row in a list or card: a title, a meta
│   line, an icon or avatar, a value or an action ─── List Item
├── a row that expands in place: a FAQ, a settings
│   group, an order summary ───────────────────────── Accordion Item
├── an event in a schedule, a week view or an agenda ─ Event Chip, Color by meaning or calendar
├── which series a chart's color stands for ───────── Legend: Dot for area and pie, Square for bars,
│                                                     Line for lines; Value on for a figure
├── a trend beside a number: a KPI card, a table
│   column ─────────────────────────────────────────── Sparkline: Medium in a card, Small in a cell
└── a break between two groups ────────────────────── Divider, when space alone doesn't separate them
```

Why:

- **Switch or Checkbox:** a switch acts the moment it flips; a checkbox waits for Save. A switch in
  a form with a Save button misstates when the change happens.
- **Segmented Control or Tabs:** both show one of several views. A segmented control changes what one
  piece of content shows, such as a chart's range or a price's billing period, and sits inside it.
  Tabs split a panel into sections and sit at its top.
- **Tooltip** holds a label and nothing else. It can't be reached by touch or tabbed into, so a link
  or a button inside one is unusable: put those in a Popover.
- **Alert Dialog** blocks everything behind it. Use it only when going on without an answer would
  lose work or data; everything else is an Alert or an inline message.
- **Popover or Dialog:** a popover belongs to its trigger and closes on a click outside, so it
  suits a quick choice or a short form; a dialog covers the page under a scrim, so it is for work
  the person finishes or dismisses before going on. One floating layer at a time: opening a dialog closes
  any open popover, so a mock never shows both.
- **List Item or Menu row:** a Menu row is a target, with hover, focus and a selected state, and it
  belongs in a Popover or a nav list. A List Item has no states: it shows content, and only its
  Button, Icon Button or Checkbox is a target. A list whose rows each open a page is Menu rows.
- **Skeleton or Progress:** a Skeleton stands in for content whose shape is known, for the second
  or two it takes to arrive; Progress reports a task with an end, and Indeterminate covers a longer
  wait with no shape to show.
- **Checklist Item, Multistepper or Agent Step:** a checklist is a set of conditions in any order,
  read at a glance; a Multistepper is a numbered plan on a spine; Agent Steps report a run while it
  happens.
- **Date Tile or Calendar:** a Date Tile is one day with its weekday, for a strip of a week or a
  few bookable days; a Calendar is a month grid for picking any date or a range.
- **Dialog or Alert Dialog:** Alert Dialog always has a Primary confirm and no body, so a form, or
  a notice with only "Close", is a Dialog.
- **Sparkline or a chart card:** a Sparkline shows only the shape of a trend, with no axes, and
  the number beside it carries the value. When the reader needs to read values off the line, use a
  Line or Area chart card from the Charts page. Its color names the series, not good or bad: put the
  verdict in a Badge.

## Set the properties

**Style**, on Button, Icon Button and Button Group:

```
the one next step in the view ─────────────────────── Primary
the alternative beside it: Cancel, Deny, Back ─────── Outline
a secondary action on a card or in a form ─────────── Outline
a secondary action in a toolbar or header bar ─────── Fill + Tone Neutral
a menu trigger, or an icon in a toolbar or a row ──── Ghost
a suggestion chip ─────────────────────────────────── Fill + Tone Default, Tiny
```

**Tone:** Destructive when the action removes, revokes or can't be undone. Neutral for a gray
button, on Fill only. Default for everything else.

**Size:**

```
dense tables, packed toolbars, chips in a row ─────── Tiny 28
buttons, icon buttons, tabs, segmented controls,
  dropdown menus, checkboxes, radios, switches,
  breadcrumbs, pagination, links, badges in app UI ── Small 36 (Badge Small is 24)
form fields: Input, Select, Text Area, Multiselect ── Medium 44
a field in a top bar or toolbar ───────────────────── Small 36, the bar's size
a primary list in a panel, as Menu rows ───────────── Medium 44
a sign-in, onboarding or other desktop form ───────── Medium 44, fields and buttons alike
a native touch app, or when the person asks ───────── Large 52
```

Why: this is what the kit's own screens do. 134 of its 154 buttons are Small and four in five of its
fields are Medium. Large reads oversized on a desktop screen, even on a sign-in page. Rule 4 still
wins: a field and a button in one row both take the field's size, and a control in a bar takes the
bar's size (breadcrumbs in a top bar of Small controls are Small).

**Color**, on Badge, Counter and Icon Badge (and Avatar, below):

```
success, passed, done ─────────────────────────────── Green
failed, error, revoked ────────────────────────────── Red
waiting, needs attention ──────────────────────────── Yellow
running, current, new ─────────────────────────────── Accent
a tag, a count, metadata ──────────────────────────── Neutral
a category with no status ─────────────────────────── Orange, Violet, Sky, Pink, Lime or Brown, one per category, fixed
```

Avatar takes the same `Color` on Name and Icon, but as identity, not status: one color per person
or agent, kept everywhere it appears.

A family a rebrand renamed (Violet to Blue, `vetra-tokens`' rebrand) is renamed in every `Color`
option too: use the file's name.

Why: a status color means the same thing everywhere in the product, and a category that borrows
red or green reads as a status. Badge Style: Tinted by default, Filled for the one badge that must
stand out, Ghost in dense rows. Alert carries its own color through `Type`.

**State:** a mock or a screenshot shows Default; show Hover, Focused or Active only when that state
is the point of the picture. In code, interaction drives the state; never hard-code one.

## Compose

Measured from the kit's own screens. Pick the container by where it sits, not by what it holds: on
the page it is a Card, even with a header and a footer; over the page it is a popover or a dialog.

| Pattern | Container | Inside |
| --- | --- | --- |
| Notifications, activity | Popover 400px, Header on | Two Line Menu rows (avatar, the event, its time), a Link to all of them in the Footer. Hangs 8 below the bell |
| Menu, dropdown | Popover, `Size` 256px or 320px (400px for a wide picker) | Menu rows filling the width, built as one component and swapped into `Content`: Small in a dropdown, Medium in a primary list. Groups split by Divider `Type` Line. A destructive row goes last, after a divider, in `red/text`. Hangs 8 below its trigger, aligned to the trigger's outer edge so it opens toward the middle of the screen |
| Form popover | Popover, `Size` 480px, `Header` and `Footer` on | The body is a component padded 4/12/12/12 with gap 16, swapped into `Content`; the footer puts Primary at the right. Hangs 8 below its trigger |
| Dialog | Dialog, over `overlay/scrim`. `Size` 480px, 640px, or 800px with its own nav column | The body is a component swapped into `↳ Content`. Small buttons at the bottom right, Primary last |
| Confirmation | Alert Dialog | A verb-echo pair such as "Delete 3 files / Keep files", never OK and Cancel |
| Scrim, in Figma | A frame-sized auto-layout frame at 0, 0, absolute, `overlay/scrim` fill, both axes centered | The dialog, centered by the scrim's layout |
| Empty state | none, centered in its region | Icon Badge 48 Tinted Neutral, gap 16; title `text-lg-18px/medium`; one line of `text-sm-14px/regular` `text/secondary`, 360 wide at most; one Small button |
| Command palette | `b2`, `stroke/primary`, `box-shadow/lg`, `radius-12`, 640 wide | Ghost Input Field as the search row; Divider; results as Menu rows in padding 4; Divider; footer 12/16/12/16 with Tiny Kbd keys and a `text-xs` label per hint; a row's shortcut is the Menu right add-on `Type` Badge with its nested Badge swapped for a Tiny Kbd |
| Card, panel | `b1`, `stroke/secondary`, `radius-12` | Padding 20 with gap 16; 16 with gap 12 when compact. A panel with sections pads each section instead |
| Form | none | Every field's Label on; fields fill the width, 16 apart; the hint under the field; an error hint says how to fix it |
| Toolbar | none | Ghost Icon Buttons of one size, each with a Tooltip; a Button Group for joined toggles |
| List in a card | Card with padding 4, a header padded 12/12/8/12 | List Item rows filling the width, one Size and one Content per list, split by Divider `Stroke` Secondary in a rule padded 4/12/4/12; the same for stacked Accordion Items |
| Table | none | One Table (Header) per column over cells of one Type: Medium rows 64 under a 44 header, Small rows 52 under a 36 header |

"Hangs 8 below its trigger" measures from the trigger's container when the trigger sits in a
padded toolbar or card: the kit's Share project tile hangs 8 below the toolbar, 16 below its button.

## Before you finish

Check the whole view and fix every miss:

- Exactly one Primary; none in a read-only view.
- Every icon-only control has a Tooltip, and in code an accessible name. In a static mock the
  Tooltip is not drawn; show one only when hover is the point of the picture.
- No square placeholder glyph and no "Label", "Button", "Input text" or "Hint text" left.
- Every destructive action has Tone Destructive and isn't Primary, except the confirm of a
  destructive Alert Dialog.
- Controls that share a row share a size.
- Every field shows its Label, and every error says how to fix it. One exception: a search field in
  a top bar or toolbar shows its icon and a placeholder instead, as the kit's own screens do.
- A count sits in its control's Counter, not beside it.
- A number column in a table is right-aligned: `Align` Right on its header and its Text cells.
- Rules between the rows of a list or table are Divider `Stroke` Secondary; Primary is for
  sections and groups.

## References

- `references/inventory.md`: every component's properties, defaults and rules, and where nested
  state lives
- `vetra-tokens`: colors, spacing, type, shadows and focus rings
