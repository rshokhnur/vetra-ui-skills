# Rebrand the accent

For a team that gives its copy of Vetra UI its own brand color. The accent is one family of eight
roles; the other families, the rings and every component follow it through variables, so the
change is values, never components.

## 1. Derive the options

```bash
node scripts/derive-brand.mjs "#3410B8"           # --tint 0.8 sets the neutral tint, 0 = pure gray
node scripts/derive-brand.mjs "#3410B8" --default "#636ade"   # option D: an exact solid you choose
```

It prints three accent options, a neutral ramp turned to the brand's hue, the contrast of each option,
and `nearFamilies`: kit families whose hue sits within 25° of the brand. `marksPassDark` says whether
the solid clears 3:1 on every dark surface a mark sits on (`b1`, `b2`, its own tint): dots,
checkboxes, focus bands and filled icons disappear below it.

| Option | What it is | Pick it when |
| --- | --- | --- |
| A, hue only | The brand's hue at the kit's lightness per role | The product should look like the kit, in the brand's hue. Contrast matches the kit exactly |
| B, exact | The brand color itself as the solid fill | Only if `defaultOnCardDark` is 3 or more. A dark brand color on a dark card makes dots, checkboxes and focus bands disappear |
| C, brand-leaning | The brand's hue and chroma, as light as white-on-fill 4.5:1 allows | The brand must read strongly, or the team needs AA on filled labels |
| D, exact solid | The `--default` you pass, with states stepped from it and text re-checked | The person moves a chosen option's lightness ("one step darker"). Re-run with `--default`; never edit `default` alone, or hover, active and text fall out of step |

Show the person all three, rendered in light and dark, with the script's numbers. They pick. Never
pick for them: the accent is the brand. Flag any option whose `marksPassDark` is false.

## 2. Apply it in Figma

Set all eight `accent/*` roles in both modes (`setValueForMode`). The solid roles, `default`, `hover`
and `active`, take the same value in light and dark. Rings, bevels and components follow on their own.

Tinted neutrals, if wanted, go in as a **new mode** of the `theme` collection, made the default:
`const id = theme.addMode('brand')`, set the eleven `neutral/n-*` steps, then `theme.setDefaultMode(id)`
(it works, though the typings omit it). The kit's own showcase pages pin the Neutral theme and stay
gray; every new page inherits the default.

Then update the accent's variable descriptions: the new hex, and each contrast number from the
script's output.

## 3. A family near the new hue

Each family in `nearFamilies` reads as a second accent. Ask which fix the person wants:

- **Retune and rename it.** Give it new values, for example the kit's old accent (`#398EF6` family),
  and rename everything that says its old name: the `{fam}/*` variables and their code syntax,
  `ring/{fam}`, the `Color` variant options on Badge, Counter and Icon Badge, and the labels on the
  Colors and Effects pages.
- **Keep it and keep it apart**: never next to accent elements, never as a status color.

## 4. Code

Export the team's tokens with `vetra-figma/references/export-tokens.js` and use its `tokens.css` in
place of the stock one. A renamed family or an added theme mode shows up in its header comments.
