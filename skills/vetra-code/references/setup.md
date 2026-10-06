# Setting up Vetra UI in a project

Read once, before the first component. `SKILL.md` keeps the three rules from here that break things
silently; this file has the steps for each stack.

```
Did the team change any variable, style or theme in their Figma file (a rebrand, a renamed token)?
│   yes: run ../../vetra-figma/references/export-tokens.js through use_figma on their file (it returns in
│   parts; its header says how to join them) and use the result as tokens.css everywhere below. The
│   shipped tokens.css is the stock Vetra UI 1.0. Export again whenever the file's variables change:
│   a variable added after the export is missing from tokens.css.
│   A MISSING family and an EXTRA family with the same set of roles is one family renamed:
│   map it and tell the person which pair you read as a rename.
│   A renamed family or token is renamed in your project's copies of every asset, never in the skill:
│   vetra-tailwind.css (colors and ring-*), vetra-shadcn.css (chart-*), families.ts (this folder), and
│   each component's color prop. `sed -i '' 's/violet/blue/g'` on the copies does it for a family
│   (BSD sed on macOS; GNU sed takes `sed -i` with no `''`).
│   An EXTRA color, ring or font needs its own line in your copy of vetra-tailwind.css: the assets
│   list only the stock tokens. a line such as `--color-glass-fill: var(--glass-fill);` for a color,
│   `--shadow-ring-{name}` for a ring, `--font-display: var(--font-display);` for a font.
│   A variable the export flags "no WEB code syntax" goes back to the designer to fix in Figma.
components.json in the project? ──────── shadcn/ui on Tailwind v4
│   copy ../assets/vetra-tailwind.css, ../assets/vetra-shadcn.css and ../../vetra-tokens/assets/tokens.css
│   delete the :root { } and .dark { } color blocks shadcn wrote into the global CSS, and the
│   --font-sans, --font-mono and --font-heading lines in its @theme inline block: the fonts come
│   from vetra-tokens.css, and font-sans / font-mono read them through var()
│   replace components/ui/button.tsx with button.tsx (this folder). "style": "base-nova" in
│   components.json means Base UI: it composes with `render={<Button />}` and has no Slot, so
│   delete the Slot lines the file's header lists. On a Radix style, `npm i radix-ui` if missing
│   replace lib/utils.ts with utils.ts (this folder): section A when package.json has `cn`,
│   section B otherwise (`npm i clsx tailwind-merge`)
│   edit other components with shadcn.md (this folder) as you first use them
│   after every `shadcn add`: its components import `cn` from "cn", which bypasses utils.ts.
│   Point them at "@/lib/utils" (macOS/BSD sed; on GNU sed drop the `''`):
│   sed -i '' 's|from "cn"|from "@/lib/utils"|' src/components/ui/*.tsx
tailwindcss 4 in package.json? ────────── copy tokens.css and vetra-tailwind.css; with React, also
│                                           button.plain.tsx and utils.ts section B (this folder)
tailwindcss 3? ─────────────────────────── copy tokens.css and ../assets/vetra-tailwind.v3.js; add it as a
│                                           preset in tailwind.config.js; import tokens.css before the
│                                           @tailwind directives. Same utility names as v4
anything else ──────────────────────────── copy tokens.css; write var(--token) and the text-style classes
```

The global stylesheet, in this order:

```css
@import "tailwindcss";
@import "tw-animate-css";                  /* shadcn only, as its init wrote them */
@import "shadcn/tailwind.css";             /* shadcn only */
@import "./vetra-tokens.css" layer(base); /* vetra-tokens/assets/tokens.css, copied under this name */
@import "./vetra-tailwind.css";
@import "./vetra-shadcn.css" layer(base); /* shadcn only */
/* then shadcn's @custom-variant dark and its @theme inline block, without the font lines */
```

Why `layer(base)`: Tailwind's utilities then override the token file's text-style classes. Imported
unlayered, a class like `.text-sm-14px-regular` beats every utility, and its `font` shorthand
silently cancels `font-semibold` and `tabular-nums` on the same element.

Why `utils.ts`: shadcn's `cn()` doesn't know Vetra's class names. It reads
`text-xs-12px-medium` as a text color, so `cn("text-xs-12px-medium", "text-text-primary")` drops the
text style and the label renders at 16px with no error. The build passes; only the render shows it.
Under Tailwind, write `text-xs font-medium`, as the Tailwind column under Figma to code does.

**Fonts.** `tokens.css` names the families `"Geist"` and `"Geist Variable"`. Load them first: plain
HTML takes the Google Fonts link for Geist and Geist Mono; Vite and other bundlers take
`npm i @fontsource-variable/geist @fontsource-variable/geist-mono`, imported once in the entry file
(`shadcn init` may have added the first already). Without a loader the page falls back to the
system font with no error. With Next.js (`next/font/google` or the `geist` package), register the fonts as `variable: "--font-geist-sans"` and
`"--font-geist-mono"` (shadcn's init writes `--font-sans`: change it), then add
`:root { --font-sans: var(--font-geist-sans), "Geist", sans-serif; --font-mono: var(--font-geist-mono), "Geist Mono", monospace; }`
after the imports, so the tokens follow whatever family `next/font` registers. A team's own face
(a `--font-display` in the export) loads the same way.

Check the load in a browser without Geist installed (Playwright's Chromium): after
`await document.fonts.ready`, `[...document.fonts].some(f => f.family.includes("Geist") && f.status === "loaded")`
is true. Three checks that lie: `getComputedStyle(...).fontFamily` names Geist even when the fallback
renders; `document.fonts.check()` answers true for a family it holds no face for; and on a machine
with Geist installed the stack's first name, `"Geist"`, matches the local copy, so the web face stays
`unloaded` and the page looks right either way.

**Modes and themes.** Put `class="dark"` or `data-mode="dark"`, and `data-theme="cool"` or `"warm"`, on
`<html>`. A theme the team added to its file is one more `data-theme` value; the exported
`tokens.css` puts the file's default theme on `:root`. With `next-themes`, use `attribute="class"`
and `disableTransitionOnChange` for the mode; it doesn't write a second attribute, so set the theme
yourself: `document.documentElement.dataset.theme = "cool"`, in a script in `<head>` so the first
paint is right. Without `next-themes`, the same script sets the mode:
`<script>if (matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark")</script>`.
Never set the page's mode on a wrapper div: menus, dialogs and tooltips render in a portal under `<body>`, outside the
wrapper, and come out in the other mode.

**Light and dark side by side** (a showcase, a docs page, a review of both modes) is the one place
for wrappers. Each tile carries `data-mode` and `data-theme` (both: `vetra-tokens`, Modes and
themes) and provides them through a context; every portaled layer keeps portaling to `<body>` and
spreads the same attributes on its own outermost element:

```tsx
const ModeAttrs = React.createContext<{ "data-mode"?: "light" | "dark"; "data-theme"?: string }>({})
// tile:  <div data-mode="dark" data-theme="neutral"><ModeAttrs.Provider value={{ "data-mode": "dark", "data-theme": "neutral" }}>…
// layer: const mode = React.useContext(ModeAttrs)
//        Base UI: <PopoverPrimitive.Positioner {...mode}>, <DialogPrimitive.Backdrop {...mode}> and <DialogPrimitive.Popup {...mode}>
//        Radix:   <PopoverPrimitive.Content {...mode}>, <DialogPrimitive.Overlay {...mode}> and <DialogPrimitive.Content {...mode}>
```

Never hand the tile to a live modal as its portal `container`: a modal portaled inside a wrapper lets
Tab walk out of it to the page (measured on Base UI). The simpler page has one live modal outside the
tiles, in the page's own mode, opened from a button. A dialog drawn open inside a tile as a picture
is the exception: portal it into the tile (`container`), give the tile `transform-gpu` so the
`fixed` popup and scrim center on the tile, and pass `modal={false}` and no initial focus
(`initialFocus={false}` on Base UI's Popup, `onOpenAutoFocus={e => e.preventDefault()}` on Radix), so
it neither traps nor steals focus from the live one.
