// lib/utils.ts on Vetra UI: the cn() that merges Vetra's class names correctly.
//
// cn() merges classes with tailwind-merge rules, which only know Tailwind's default theme.
// Vetra's names fall outside it: text-xs-12px-medium reads as a text color, so
// cn("text-xs-12px-medium", "text-text-primary") returns "text-text-primary" and the text
// silently renders at 16px. rounded-12 and shadow-ring-accent are left unmerged, so an override
// passed through className keeps both classes and whichever Tailwind emits last wins.
// Registering the names puts each one in its real group.
//
// Two versions of the same file:
//   A. package.json has `cn` (current shadcn installs it): use this file as it is.
//   B. no `cn` package (older shadcn, or no shadcn): `npm i clsx tailwind-merge`, delete section A
//      and uncomment section B. The groups are the same; they stay inline in each call so
//      TypeScript checks them against the library's own types.

// ── A. The `cn` package ───────────────────────────────────────────────────────────────────────────
import { createCn } from "cn/config"

const textStyle = (v: string) => /^(2xs|xs|sm|base|lg|xl|[2-7]xl)-\d+px-(regular|medium|semibold)$/.test(v)
const monoStyle = (v: string) => /^(xs|sm|base|2xl)-\d+px-(regular|medium)$/.test(v)

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["2xs", textStyle] }, { mono: [monoStyle] }],
      rounded: [{ rounded: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "20", "24", "32"] }],
      shadow: [{ shadow: [(v: string) => /^(ring|actions)-[a-z-]+$/.test(v)] }],
    },
  },
})

// ── B. clsx + tailwind-merge ──────────────────────────────────────────────────────────────────────
// import { clsx, type ClassValue } from "clsx"
// import { extendTailwindMerge } from "tailwind-merge"
//
// const textStyle = (v: string) => /^(2xs|xs|sm|base|lg|xl|[2-7]xl)-\d+px-(regular|medium|semibold)$/.test(v)
// const monoStyle = (v: string) => /^(xs|sm|base|2xl)-\d+px-(regular|medium)$/.test(v)
//
// const twMerge = extendTailwindMerge({
//   extend: {
//     classGroups: {
//       "font-size": [{ text: ["2xs", textStyle] }, { mono: [monoStyle] }],
//       rounded: [{ rounded: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "20", "24", "32"] }],
//       shadow: [{ shadow: [(v: string) => /^(ring|actions)-[a-z-]+$/.test(v)] }],
//     },
//   },
// })
//
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
