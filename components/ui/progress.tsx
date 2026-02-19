"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// Progress — Numetria Glass Intelligence
// Track  : Ice Blue faint rgba(141,194,255,0.1)
// Fill   : Blue Harbor → Primary Light → Sunny Herb gradient
// At low values  → deep blue tones
// At high values → lime energy visible at the leading edge

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full",
        "bg-[rgba(141,194,255,0.1)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 rounded-full",
          "bg-gradient-to-r from-[#3770bf] via-[#5a8fd4] to-[#cef26d]",
          "transition-all duration-700 ease-out",
          // Shimmer overlay
          "relative overflow-hidden",
          "after:absolute after:inset-0",
          "after:bg-gradient-to-r after:from-transparent after:via-white/[0.12] after:to-transparent",
          "after:animate-shimmer"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
