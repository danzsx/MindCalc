"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Grid3X3,
  Dumbbell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/lessons", label: "Aulas", icon: BookOpen },
  { href: "/tabuada", label: "Tabuada", icon: Grid3X3 },
  { href: "/train", label: "Treinar", icon: Dumbbell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-xl" />

        {/* Nav container */}
        <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-2 flex items-center justify-around">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl font-medium transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25"
                    : "text-white/60 active:scale-95"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
