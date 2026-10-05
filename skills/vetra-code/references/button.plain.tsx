// Vetra UI Button for React + Tailwind v4 (with vetra-tailwind.css), without shadcn/ui.
// The same classes as button.tsx, minus shadcn's name mapping and the radix-ui Slot.
// Needs: npm i class-variance-authority clsx tailwind-merge, and lib/utils.ts from
// references/utils.ts (section B). The "@/lib/utils" import needs the "@" alias: Vite
// `resolve: { alias: { "@": path.resolve(__dirname, "src") } }` and tsconfig
// `"paths": { "@/*": ["./src/*"] }` with no `baseUrl` (TypeScript 6 deprecates it); or import
// "../lib/utils" relatively.
// Props mirror the Figma component:
//   size    Tiny 28 · Small 36 · Medium 44 · Large 52      → "tiny" | "small" | "medium" | "large"
//   variant Style: Primary · Fill · Outline · Ghost        → "primary" | "fill" | "outline" | "ghost"
//   tone    Default · Destructive · Neutral (Fill only)   → "default" | "destructive" | "neutral"
//   icon    true for the square Icon Button; give it an aria-label
// A link that looks like a button: <a className={buttonVariants({ variant: "outline" })} href="…">.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
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

type ButtonProps = Omit<React.ComponentProps<"button">, "type"> &
  VariantProps<typeof buttonVariants> & {
    type?: "button" | "submit" | "reset"
  }

function Button({ className, variant, size, tone, icon, type = "button", ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, tone, icon }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
