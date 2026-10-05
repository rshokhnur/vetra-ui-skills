# Typography

**Geist** for everything, **Geist Mono** for code and data. Both are open source (SIL Open Font
License) from Vercel: install the `geist` npm package or load them from Google Fonts. `tokens.css`
names them `--font-sans` and `--font-mono` and falls back to the system stack.

Geist ships in Regular 400, Medium 500 and SemiBold 600; Geist Mono in Regular and Medium. Bold is
not part of the system.

## The ramp

A style fixes size, line height and tracking together; never set one of the three on its own.
In code each Figma style is one class: `text-sm-14px/medium` → `.text-sm-14px-medium`.

| Step | Size / line height | Tracking | Where the kit uses it |
| --- | --- | --- | --- |
| `text-7xl-72px` | 72 / 76 | −1% | Display |
| `text-6xl-60px` | 60 / 68 | −1% | Display |
| `text-5xl-48px` | 48 / 56 | −1% | A hero stat |
| `text-4xl-36px` | 36 / 42 | −1% | A headline stat |
| `text-3xl-30px` | 30 / 36 | −1% | Page title |
| `text-2xl-24px` | 24 / 32 | −1% | Page title in an app; a metric |
| `text-xl-20px` | 20 / 28 | −1% | Card and section headings, in Medium |
| `text-lg-18px` | 18 / 28 | −1% | Card headings; dialog titles in Medium; Large control labels |
| `text-base-16px` | 16 / 24 | 0 | Body; Medium control labels |
| `text-sm-14px` | 14 / 20 | 0 | Body in dense UI; list item titles; Small control labels |
| `text-xs-12px` | 12 / 16 | 0 | Meta, captions, timestamps; Tiny control labels |
| `text-2xs-10px` | 10 / 12 | 0 | Only a count inside a pill, and the Tiny badge |

Every step ships in `/regular`, `/medium` and `/semibold`: 36 styles.

Tracking is −1% (`-0.01em`) from 18px up and 0 below.

## Mono

| Step | Size / line height | Use |
| --- | --- | --- |
| `mono-2xl-24px` | 24 / 32 | Headline figures above a table of mono numbers |
| `mono-base-16px` | 16 / 24 | Code set at body size |
| `mono-sm-14px` | 14 / 20 | Code blocks; branch names, commit hashes, file paths, test output |
| `mono-xs-12px` | 12 / 16 | A tool call's target; timestamps, durations, costs and counts in dense rows |

Each ships in `/regular` and `/medium`: 8 styles. The metrics match the sans ramp and tracking is 0,
since Geist Mono is already wider than Geist.

## CSS

`tokens.css` defines all 44 classes. Each is one line:

```css
.text-sm-14px-medium { font: 500 14px/20px var(--font-sans); letter-spacing: 0; }
.text-lg-18px-semibold { font: 600 18px/28px var(--font-sans); letter-spacing: -0.01em; }
.mono-xs-12px-regular { font: 400 12px/16px var(--font-mono); letter-spacing: 0; }
```

`font` is a shorthand and resets `font-variant-numeric`. Add `tabular-nums` after the class when
figures must line up in a column.
