// Vetra UI color families as complete Tailwind class strings, for Badge, Counter, Icon Badge,
// tags and chart legends. Tailwind only generates classes it can read whole in the source, so a
// template such as `bg-${fam}-fill` never compiles: look the family up here instead.
// A family the team renamed in Figma (for example violet → blue) is renamed here too.

export type Family =
  | "accent" | "red" | "orange" | "brown" | "yellow" | "lime" | "green" | "sky" | "violet" | "pink"
  | "neutral"

// Tinted: a tint, its stroke and its text. Badge Tinted, Icon Badge Tinted, a tag.
export const tinted: Record<Family, string> = {
  accent: "bg-accent-fill border-accent-stroke text-accent-text",
  red: "bg-red-fill border-red-stroke text-red-text",
  orange: "bg-orange-fill border-orange-stroke text-orange-text",
  brown: "bg-brown-fill border-brown-stroke text-brown-text",
  yellow: "bg-yellow-fill border-yellow-stroke text-yellow-text",
  lime: "bg-lime-fill border-lime-stroke text-lime-text",
  green: "bg-green-fill border-green-stroke text-green-text",
  sky: "bg-sky-fill border-sky-stroke text-sky-text",
  violet: "bg-violet-fill border-violet-stroke text-violet-text",
  pink: "bg-pink-fill border-pink-stroke text-pink-text",
  neutral: "bg-fill-tertiary border-stroke-secondary text-text-primary",
}

// Filled: the solid fill with its label and icon on-color. Badge Filled, Counter, Icon Badge Filled.
export const filled: Record<Family, string> = {
  accent: "bg-accent-default text-on-color",
  red: "bg-red-default text-on-color",
  orange: "bg-orange-default text-on-color",
  brown: "bg-brown-default text-on-color",
  yellow: "bg-yellow-default text-on-color",
  lime: "bg-lime-default text-on-color",
  green: "bg-green-default text-on-color",
  sky: "bg-sky-default text-on-color",
  violet: "bg-violet-default text-on-color",
  pink: "bg-pink-default text-on-color",
  neutral: "bg-gray-secondary text-on-color",
}

// Ink: text or an icon in the family's color, on any surface. Badge Ghost, a status line.
export const ink: Record<Family, string> = {
  accent: "text-accent-text",
  red: "text-red-text",
  orange: "text-orange-text",
  brown: "text-brown-text",
  yellow: "text-yellow-text",
  lime: "text-lime-text",
  green: "text-green-text",
  sky: "text-sky-text",
  violet: "text-violet-text",
  pink: "text-pink-text",
  neutral: "text-text-primary",
}

// Mark: a filled dot, a chart series, a rating star. Never text: {fam}/default fails 4.5:1.
export const mark: Record<Family, string> = {
  accent: "bg-accent-default",
  red: "bg-red-default",
  orange: "bg-orange-default",
  brown: "bg-brown-default",
  yellow: "bg-yellow-default",
  lime: "bg-lime-default",
  green: "bg-green-default",
  sky: "bg-sky-default",
  violet: "bg-violet-default",
  pink: "bg-pink-default",
  neutral: "bg-gray-secondary",
}

// Glow: a halo or decorative wash, {fam}/default at 24%. Never under a label.
export const glow: Record<Exclude<Family, "neutral">, string> = {
  accent: "bg-accent-glow",
  red: "bg-red-glow",
  orange: "bg-orange-glow",
  brown: "bg-brown-glow",
  yellow: "bg-yellow-glow",
  lime: "bg-lime-glow",
  green: "bg-green-glow",
  sky: "bg-sky-glow",
  violet: "bg-violet-glow",
  pink: "bg-pink-glow",
}
