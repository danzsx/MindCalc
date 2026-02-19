"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// Tabs — Numetria Glass Intelligence
// List   : Dark glass pill with Ice Blue border
// Active : Blue Harbor background, bright white text, blue glow
// Inactive: Névoa muted text, transparent bg

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-11 w-fit items-center justify-center p-1 gap-1",
        "rounded-2xl",
        "bg-[rgba(13,29,58,0.8)] backdrop-blur-xl",
        "border border-[rgba(141,194,255,0.12)]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Layout
        "inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-1.5",
        // Typography
        "text-sm font-semibold whitespace-nowrap",
        // Base state — muted, no background
        "text-[#6b89b4] hover:text-[#a8c0e0]",
        "transition-all duration-300",
        // Active state — Blue Harbor pill with glow
        "data-[state=active]:bg-[#3770bf]",
        "data-[state=active]:text-[#f0f4ff]",
        "data-[state=active]:shadow-[0_2px_16px_rgba(55,112,191,0.35)]",
        // Focus ring — lime
        "focus-visible:ring-[3px] focus-visible:ring-[rgba(206,242,109,0.35)] focus-visible:outline-none",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-40",
        // SVG icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
