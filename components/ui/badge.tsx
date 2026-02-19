import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        // ── Blue Harbor glass — default info/state badge
        default:
          "border-[rgba(55,112,191,0.4)] bg-[rgba(55,112,191,0.15)] text-[#8dc2ff]",

        // ── Muted glass — neutral / secondary label
        secondary:
          "border-[rgba(141,194,255,0.15)] bg-[rgba(13,29,58,0.6)] text-[#6b89b4]",

        // ── Ice Blue glass — soft error/warning state (not aggressive red)
        destructive:
          "border-[rgba(141,194,255,0.3)] bg-[rgba(141,194,255,0.1)] text-[#8dc2ff]",

        // ── Transparent outline — ghost label
        outline:
          "border-[rgba(141,194,255,0.2)] text-[#a8c0e0] bg-transparent",

        // ── Lime glass — success / completion
        success:
          "border-[rgba(206,242,109,0.35)] bg-[rgba(206,242,109,0.12)] text-[#cef26d]",

        // ── Lime solid — strongest accent / new feature tag
        accent:
          "border-transparent bg-[#cef26d] text-[#080f1e]",

        // ── Operation variants — Numetria remapped palette
        addition:
          "border-[rgba(55,112,191,0.4)] bg-[rgba(55,112,191,0.15)] text-[#8dc2ff]",

        subtraction:
          "border-[rgba(141,194,255,0.35)] bg-[rgba(141,194,255,0.12)] text-[#8dc2ff]",

        multiplication:
          "border-[rgba(206,242,109,0.35)] bg-[rgba(206,242,109,0.12)] text-[#cef26d]",

        division:
          "border-[rgba(168,204,71,0.35)] bg-[rgba(168,204,71,0.12)] text-[#a8cc47]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
