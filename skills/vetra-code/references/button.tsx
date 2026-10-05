// Vetra UI Button for React + Tailwind v4 (with vetra-tailwind.css) + class-variance-authority.
// Drop-in for shadcn/ui's components/ui/button.tsx. Props mirror the Figma component:
//   size    Tiny 28 · Small 36 · Medium 44 · Large 52      → "tiny" | "small" | "medium" | "large"
//   variant Style: Primary · Fill · Outline · Ghost        → "primary" | "fill" | "outline" | "ghost"
//   tone    Default · Destructive · Neutral (Fill only)   → "default" | "destructive" | "neutral"
//   icon    true for the square Icon Button
// shadcn's own names still work, so its other components keep compiling: variant "default",
// "secondary", "destructive", "link" and size "default", "xs", "sm", "lg", "icon", "icon-xs",
// "icon-sm", "icon-lg" are mapped onto the Vetra ones below.
// Needs `radix-ui` for Slot (asChild). On the "base-nova" style (Base UI) other components compose
// with render={<Button />} and nothing passes asChild, so don't install radix-ui; delete instead:
//   1. the `import { Slot } from "radix-ui"` line
//   2. `asChild?: boolean` in ButtonProps, and `asChild = false, ` in Button's parameters
//   3. `const Comp = asChild ? Slot.Root : "button"`, then write <button> for <Comp>
//      and `type={type}` for `type={asChild ? undefined : type}`
// Without shadcn, use references/button.plain.tsx: the same classes, no Slot, no shadcn names.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-medium select-none",
    "transition-[background-color,border-color,color,box-shadow] duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Disabled is a set of tokens, never opacity: opacity composites with whatever is underneath.
    "disabled:pointer-events-none disabled:shadow-none disabled:text-text-quaternary disabled:[&_svg]:text-gray-quaternary",
  ],
  {
    variants: {
      size: {
        tiny: "h-7 px-2 rounded-8 text-xs [&_svg]:size-3",
        small: "h-9 px-3 rounded-10 text-sm [&_svg]:size-4",
        medium: "h-11 px-4 rounded-12 text-base [&_svg]:size-5",
        large: "h-13 px-5 rounded-14 text-lg [&_svg]:size-6",
      },
      variant: {
        primary: "disabled:bg-fill-secondary disabled:border-stroke-secondary",
        fill: "border-transparent disabled:bg-fill-secondary",
        outline: "bg-background-b2 disabled:bg-fill-secondary disabled:border-stroke-secondary",
        ghost: "border-transparent bg-transparent",
        link: "h-auto border-transparent px-0 text-accent-text underline-offset-4 hover:underline",
      },
      tone: { default: "", destructive: "", neutral: "" },
      icon: { true: "px-0 aspect-square", false: "" },
    },
    compoundVariants: [
      // Primary: the solid family fill. White label; bevel at rest and on hover; flat when pressed.
      // The ring's band follows the fill, so it is the on-color ring.
      {
        variant: "primary", tone: "default",
        class: "bg-accent-default border-accent-default text-on-color shadow-actions-primary hover:bg-accent-hover hover:border-accent-hover hover:shadow-actions-primary-hover active:bg-accent-active active:border-accent-active active:shadow-none focus-visible:shadow-ring-accent-on-color",
      },
      {
        variant: "primary", tone: "destructive",
        class: "bg-red-default border-red-default text-on-color shadow-actions-primary hover:bg-red-hover hover:border-red-hover hover:shadow-actions-primary-hover active:bg-red-active active:border-red-active active:shadow-none focus-visible:shadow-ring-red-on-color",
      },
      // Fill: the tint. Only accent and red have a hover tint.
      {
        variant: "fill", tone: "default",
        class: "bg-accent-fill text-accent-text hover:bg-accent-fill-hover active:bg-accent-fill-active focus-visible:shadow-ring-accent",
      },
      {
        variant: "fill", tone: "destructive",
        class: "bg-red-fill text-red-text hover:bg-red-fill-hover active:bg-red-fill-active focus-visible:shadow-ring-red",
      },
      {
        variant: "fill", tone: "neutral",
        class: "bg-fill-secondary text-text-primary [&_svg]:text-gray-primary hover:bg-fill-primary active:bg-fill-primary active:wash-tertiary focus-visible:shadow-ring-gray",
      },
      // Outline: the raised neutral surface. Hover and press wash over it and drop the bevel.
      {
        variant: "outline", tone: "default",
        class: "border-stroke-primary text-text-primary [&_svg]:text-gray-primary shadow-actions-secondary hover:wash-tertiary hover:shadow-none active:wash-secondary active:shadow-none focus-visible:shadow-ring-accent",
      },
      {
        variant: "outline", tone: "destructive",
        class: "border-red-stroke text-red-text shadow-actions-secondary hover:bg-red-fill-hover hover:border-red-default hover:shadow-none active:bg-red-fill-active active:border-red-default active:shadow-none focus-visible:shadow-ring-red",
      },
      // Ghost: no surface until touched.
      {
        variant: "ghost", tone: "default",
        class: "text-text-primary [&_svg]:text-gray-primary hover:bg-fill-tertiary active:bg-fill-secondary focus-visible:shadow-ring-accent",
      },
      {
        variant: "ghost", tone: "destructive",
        class: "text-red-text hover:bg-red-fill active:bg-red-fill-active active:border-red-stroke focus-visible:shadow-ring-red",
      },
    ],
    defaultVariants: { size: "small", variant: "primary", tone: "default", icon: false },
  }
)

type VetraVariant = "primary" | "fill" | "outline" | "ghost" | "link"
type VetraSize = "tiny" | "small" | "medium" | "large"
type ShadcnVariant = "default" | "secondary" | "destructive"
type ShadcnSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

// shadcn's names → Vetra's, so shadcn components that call buttonVariants() keep working.
const fromShadcn = (variant?: VetraVariant | ShadcnVariant | null, size?: VetraSize | ShadcnSize | null) => {
  const v: Record<ShadcnVariant, [VetraVariant, "default" | "destructive" | "neutral"]> = {
    default: ["primary", "default"],
    secondary: ["fill", "neutral"],
    destructive: ["fill", "destructive"],
  }
  const s: Record<ShadcnSize, [VetraSize, boolean]> = {
    default: ["small", false], xs: ["tiny", false], sm: ["tiny", false], lg: ["medium", false],
    icon: ["small", true], "icon-xs": ["tiny", true], "icon-sm": ["tiny", true], "icon-lg": ["medium", true],
  }
  const [variantOut, toneOut] = variant && variant in v ? v[variant as ShadcnVariant] : [variant as VetraVariant | undefined, undefined]
  const [sizeOut, iconOut] = size && size in s ? s[size as ShadcnSize] : [size as VetraSize | undefined, undefined]
  return { variant: variantOut, tone: toneOut, size: sizeOut, icon: iconOut }
}

type ButtonProps = Omit<React.ComponentProps<"button">, "type"> &
  Omit<VariantProps<typeof buttonVariants>, "variant" | "size"> & {
    variant?: VetraVariant | ShadcnVariant | null
    size?: VetraSize | ShadcnSize | null
    asChild?: boolean
    type?: "button" | "submit" | "reset"
  }

function Button({ className, variant, size, tone, icon, asChild = false, type = "button", ...props }: ButtonProps) {
  const mapped = fromShadcn(variant, size)
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : type}
      className={cn(
        buttonVariants({
          variant: mapped.variant,
          size: mapped.size,
          tone: tone ?? mapped.tone,
          icon: icon ?? mapped.icon,
        }),
        className
      )}
      {...props}
    />
  )
}

// For shadcn components that style a link or trigger like a button.
function vetraButtonVariants(options: { variant?: VetraVariant | ShadcnVariant | null; size?: VetraSize | ShadcnSize | null; tone?: "default" | "destructive" | "neutral"; icon?: boolean; className?: string } = {}) {
  const mapped = fromShadcn(options.variant, options.size)
  return cn(buttonVariants({ variant: mapped.variant, size: mapped.size, tone: options.tone ?? mapped.tone, icon: options.icon ?? mapped.icon }), options.className)
}

export { Button, vetraButtonVariants as buttonVariants }
