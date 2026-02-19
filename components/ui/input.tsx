import * as React from "react"

import { cn } from "@/lib/utils"

// Input — Numetria Glass Intelligence
// Background : Ocean Glass rgba(13,29,58,0.8)
// Border     : Ice Blue rgba(141,194,255,0.15)
// Focus      : Lime border + lime glow ring

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & shape
        "flex h-11 w-full min-w-0 rounded-2xl px-4 py-2.5",
        // Colors
        "border border-[rgba(141,194,255,0.15)] bg-[rgba(13,29,58,0.8)]",
        "text-[#f0f4ff] placeholder:text-[#6b89b4]/60",
        // File input reset
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#a8c0e0]",
        // Typography
        "text-base md:text-sm",
        // Transitions
        "transition-all duration-300 outline-none",
        // Focus — lime border + lime glow
        "focus-visible:border-[#cef26d] focus-visible:shadow-[0_0_0_3px_rgba(206,242,109,0.18)]",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        // Invalid state — ice blue (not aggressive red)
        "aria-invalid:border-[#8dc2ff] aria-invalid:shadow-[0_0_0_3px_rgba(141,194,255,0.15)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
