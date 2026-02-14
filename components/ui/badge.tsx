import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm",
        secondary:
          "border-white/10 bg-white/10 text-white/80 [a&]:hover:bg-white/15",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm",
        outline:
          "border-white/20 text-white/70 bg-transparent [a&]:hover:bg-white/5 [a&]:hover:text-white",
        success:
          "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm",
        addition:
          "border-transparent bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
        subtraction:
          "border-transparent bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/20",
        multiplication:
          "border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/20",
        division:
          "border-transparent bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/20",
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
