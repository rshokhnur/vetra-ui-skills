# Figma API traps

What goes wrong in `use_figma`, symptom and fix, most likely first. The helpers in `helpers.js`
already avoid the ones marked *(helper)*.

## Paint and bindings

**A translucent token paints solid.** *(helper)* `fill/*`, `stroke/*` and `overlay/scrim` carry their
own alpha. Build the paint from `v.resolveForConsumer(node).value`, alpha included, then bind it; a
paint built from `{r, g, b}` alone binds at 100%. Never spread-copy a bound paint (`{...paint}`) to
tweak it: build a new one.

**Binding resets a paint's opacity.** `setBoundVariableForPaint` sets the paint to the token's alpha,
and re-linking or cloning does it again, so a paint faded on top of a variable snaps back to solid.
Translucency lives in the token; the audit flags a paint whose opacity differs from its token.

**A binding silently fails.** *(helper)* Setting the `cornerRadius` shorthand clears every corner
binding but the last; bind the four corners. Binding `strokeWeight` fails once the four sides differ;
bind each side. Read `node.boundVariables` back after binding corners or sides.

**Bindings inside an instance read as empty.** `node.boundVariables` doesn't cross into an instance's
nested layers, so an audit there reports false misses. Audit your own layers; trust the instances.
`paint.boundVariables.color` is the one read that works at any depth.

**A frame renders parts in the wrong mode though every binding is right.** Some instances keep a
stale resolution after a mode was set (light surfaces with dark text in a dark frame), while
`resolveForConsumer` already returns the right value. Set the frame's mode to the other value and
back (`mode(frame, 'light'); mode(frame, 'dark')`), then screenshot again.

**`explicitVariableModes` is read-only.** Assigning it throws at the end of the script and rolls the
whole call back. Use `setExplicitVariableModeForCollection(collectionObject, modeId)`, and
`clearExplicitVariableModeForCollection` to unpin.

## Instances

**A variant switch drops other overrides.** *(helper)* Changing `Size`, `Style`, `Tone` or `State`
re-resolves the instance, and an icon swap, a label, an icon color or a fill set on a nested layer
reverts to the default. Write variants first, everything else after, then read
`componentProperties` back. Seen: a Menu row's solid active fill vanished when its State changed;
Breadcrumbs lost labels and truncation on a Size change.

**`resetOverrides()` resets everything.** It clears variant choices, counters and swaps along with
the one change you meant to undo. Undo that one property instead.

**Figma's variant error names nothing.** Figma's own error is "Unable to find a variant with
those property values", with no property. *(helper)* `props` checks each value first and lists the
options.

**A batched `setProperties` can drop a value.** *(helper)* Turn a slot's boolean on in one
`setProperties` call and swap its icon in the next. Verify on a node fetched in a later call: a
read in the same call can report a value that didn't stick.

**A resized instance keeps its old text layout.** After you set an instance to fill a wider parent,
its label can still wrap or truncate at the master's width. Render it. If the text is wrong, nudge
the instance's width by 1px and back, or toggle the text node's `textAutoResize` off and on.

**Defaults you didn't set still show.** An instance arrives with its master's defaults. Most kit
components ship their optional slots off, but `Table (Cell)` ships with every button, badge and icon
slot on: turn off what the cell doesn't use.

**An icon's color resets when you swap it.** *(helper)* A swapped icon takes the icon master's
`gray/primary`, whatever the host's fill. Swap first, then `iconColor(instance, token)`, which paints
the vector's fill. Never recolor an icon with a stroke: kit icons are outlined shapes.

**Progress takes any value through its grow weights.** `Value` steps by 10 (plus 25 and 75); for a
value between, use a Line: `Fill` and `Trail` both fill the track with `layoutGrow`, so resizing
`Fill` does nothing. For 68%, set `Fill`'s `layoutGrow` to 68 and `Trail`'s to 32. Circular has no
such trick: round to a step and label it with that step.

**`swapComponent` returns nothing.** It changes the instance in place: keep using the node you
called it on.

**A hidden slot has no children.** Turning a boolean off prunes that slot from the tree: `findOne`
returns nothing and geometry is stale. Turn the boolean on before reading or editing inside it. Never
set `.visible` on a layer a component property controls: that rewrites the property.

**A bound width beats Fill.** A component whose root width is bound to a variable, placed as a
Fill child (Popover's `Content`, Dialog's `↳ Content`, any slot), snaps back to that width the next
time the parent relayouts, such as on a `Size` change. The kit's `x-Base/Slot` hugs for that
reason. Leave the width of a component you swap into a slot unbound. A swapped component that
doesn't hug its height (a Menu row at 44) keeps the slot's old height; stack rows in an auto-layout
component that hugs.

## Layout

**`resize()` fixes both axes.** It sets width and height to `FIXED` and clears `FILL`. After a
resize, set `layoutSizingVertical = 'HUG'` (or the axis you need) and re-apply `FILL` to children.

**A hugging parent collapses a filling child to zero.** Give the parent a fixed width, or let it
fill its own parent, before any child is set to `FILL`. Never set `HUG` on an instance: its size
belongs to its master.

**`SPACE_BETWEEN` and a bound gap fight.** The gap goes inert under `SPACE_BETWEEN` but stays stored,
and wins the moment Figma re-applies it. For a title-left, control-right row: keep the bound gap and
set the title to `FILL`.

**Changing a parent's `layoutMode` rewrites its children's sizing.** A 60 tall top bar became 1064
tall when its parent went from vertical to horizontal. Build the new wrapper first and append into
it, or re-apply every child's size and sizing after the switch.

**A child moved between a row and a column keeps its old grow.** After reparenting across directions,
set both `layoutSizingHorizontal` and `layoutSizingVertical` again.

**Dimensions read in the same call are stale.** After a resize or an `appendChild`, a hugging or
wrapping frame still reports its old size. Never feed a just-read size into `resize()`; read it in
the next call.

**`width` isn't what renders.** Measure `absoluteBoundingBox` when checking overflow or fit.

**`minWidth` and `maxWidth` have limits.** They can't be bound on a text node, can't be set on an
instance, and `minHeight` can't be 0. Wrap the text or instance in a frame and constrain the frame.

**A clone lands on the page.** `clone()` of a frame inside a Section puts the copy at the page's top
level. Append it to the section yourself.

## Text

**Never set `leadingTrim`.** Trimming a line box to cap height detaches the text style.

**Reassigning `.characters` flattens mixed styling.** A string with a link or a second color
collapses to the first range's style. Edit ranges with `insertCharacters` and `deleteCharacters`,
or re-apply range styles after, and check `getStyledTextSegments`.

**Never type a text style id.** An id ends in a comma; without it `setTextStyleIdAsync` resolves to
nothing and the text stays in Inter 12, with no error. Read ids from `textStyles`.

**Geist has no U+202F, U+2009, U+2011 or U+02BB.** Figma draws nothing in their place. Use U+00A0 for
a no-break space (see `vetra-copy`).

**Load the fonts a text node already uses** (`getStyledTextSegments(['fontName'])`) before
editing it, not a default font.

**Geist Mono ligatures can't be switched off from a script.** `=>` and `!=` join into one glyph in a
code sample; ask the user to turn ligatures off in Figma's type settings.

## Images

**`createImageAsync` is blocked.** A script can't bring in a new photo. Reuse an image already in the
file by its hash: `node.fills = [{ type: 'IMAGE', imageHash, scaleMode: 'FILL' }]`. An Avatar's photo
is a fill on the instance itself, not on a child layer.

## Calls

**The MCP is rate-limited:** roughly 15 calls a minute and 200 a day per seat, shared by every agent
in the file. A refusal clears in about a minute. Merge writes into fewer calls, and take a screenshot
inside the script with `await frame.screenshot()`.

**A failed call changes nothing.** The whole script rolls back; fix it and run it again. Don't act on
the first read right after a failed call: read again.

**The audit's placeholder check exempts the Composer.** Its Stop control is a square glyph by
design; any other square in an icon slot is a placeholder.

**One page switch per script,** with `await figma.setCurrentPageAsync(page)`. Read other pages with
`await page.loadAsync()`. You can't remove the current page: switch away first.
