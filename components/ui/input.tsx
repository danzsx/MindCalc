import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-base text-white placeholder:text-white/40 transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20 focus-visible:ring-[3px] focus-visible:bg-white/[0.07]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
