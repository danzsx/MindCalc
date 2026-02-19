import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold",
    "rounded-2xl transition-all duration-300",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(206,242,109,0.35)]",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Blue Harbor — primary action
        default:
          "bg-[#3770bf] text-[#f0f4ff] shadow-lg shadow-[rgba(55,112,191,0.25)] hover:bg-[#2558a0] hover:shadow-xl hover:shadow-[rgba(55,112,191,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",

        // ── Sunny Herb — most important CTA in the interface
        accent:
          "bg-[#cef26d] text-[#080f1e] font-bold shadow-lg shadow-[rgba(206,242,109,0.2)] hover:bg-[#b8d85a] hover:shadow-xl hover:shadow-[rgba(206,242,109,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[rgba(55,112,191,0.4)]",

        // ── Ice Blue — soft destructive (non-aggressive)
        destructive:
          "bg-[rgba(141,194,255,0.1)] text-[#8dc2ff] border border-[rgba(141,194,255,0.25)] hover:bg-[rgba(141,194,255,0.18)] hover:border-[rgba(141,194,255,0.4)] hover:-translate-y-0.5 active:translate-y-0",

        // ── Glass border — secondary outlined action
        outline:
          "border border-[rgba(141,194,255,0.2)] bg-transparent text-[#f0f4ff] hover:bg-[rgba(141,194,255,0.06)] hover:border-[rgba(141,194,255,0.35)]",

        // ── Surface mid — secondary fill
        secondary:
          "bg-[#122040] text-[#a8c0e0] border border-[rgba(141,194,255,0.1)] hover:bg-[#1a2f55] hover:text-[#f0f4ff] hover:border-[rgba(141,194,255,0.2)]",

        // ── Glass ghost — tertiary / navigation
        ghost:
          "bg-transparent text-[#a8c0e0] border border-[rgba(141,194,255,0.12)] hover:bg-[rgba(141,194,255,0.07)] hover:text-[#f0f4ff] hover:border-[rgba(141,194,255,0.28)]",

        // ── Ice Blue link
        link: "text-[#8dc2ff] underline-offset-4 hover:underline hover:text-[#f0f4ff] border-none bg-transparent shadow-none",

        // ── Lime success (same as accent)
        success:
          "bg-[#cef26d] text-[#080f1e] font-bold shadow-lg shadow-[rgba(206,242,109,0.2)] hover:bg-[#b8d85a] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[rgba(55,112,191,0.4)]",

        // ── Operation variants — Numetria remapped
        addition:
          "bg-gradient-to-r from-[#3770bf] to-[#5a8fd4] text-[#f0f4ff] shadow-lg shadow-[rgba(55,112,191,0.25)] hover:shadow-xl hover:shadow-[rgba(55,112,191,0.35)] hover:-translate-y-0.5 active:translate-y-0",

        subtraction:
          "bg-gradient-to-r from-[#8dc2ff] to-[#6aaaf0] text-[#080f1e] shadow-lg shadow-[rgba(141,194,255,0.2)] hover:shadow-xl hover:shadow-[rgba(141,194,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[rgba(141,194,255,0.4)]",

        multiplication:
          "bg-gradient-to-r from-[#cef26d] to-[#b8d85a] text-[#080f1e] font-bold shadow-lg shadow-[rgba(206,242,109,0.2)] hover:shadow-xl hover:shadow-[rgba(206,242,109,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[rgba(55,112,191,0.4)]",

        division:
          "bg-gradient-to-r from-[#a8cc47] to-[#8baa35] text-[#080f1e] font-bold shadow-lg shadow-[rgba(168,204,71,0.2)] hover:shadow-xl hover:shadow-[rgba(168,204,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[rgba(168,204,71,0.4)]",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-3",
        xs: "h-7 gap-1 rounded-xl px-2.5 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-xl gap-1.5 px-3.5 has-[>svg]:px-2.5",
        lg: "h-12 rounded-2xl px-7 text-base has-[>svg]:px-5",
        xl: "h-14 rounded-2xl px-8 text-lg has-[>svg]:px-5",
        icon: "size-10 rounded-2xl",
        "icon-xs": "size-7 rounded-xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-xl",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
