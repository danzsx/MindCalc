"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "./Navbar";
import { Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle
            className="text-xl font-bold text-primary"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            MindCalc
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                pathname === href
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border px-4 py-4">
          <Link
            href="/billing"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#14B8A6] transition-colors shadow-sm"
          >
            <Sparkles size={16} />
            Assinar Pro
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
