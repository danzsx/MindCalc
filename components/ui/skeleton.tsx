import * as React from "react";
import { cn } from "@/lib/utils";

// Skeleton — Numetria Glass Intelligence
// Base   : Ocean Glass surface rgba(13,29,58,0.8)
// Shimmer: Ice Blue tint sweeping left→right
// Uses .skeleton-shimmer class defined in globals.css

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton-shimmer rounded-xl", className)}
      {...props}
    />
  );
}

export { Skeleton };
