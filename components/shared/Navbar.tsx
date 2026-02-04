"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";
import {
  LayoutDashboard,
  BookOpen,
  Grid3X3,
  Dumbbell,
  CreditCard,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/lessons", label: "Aulas", icon: BookOpen },
  { href: "/tabuada", label: "Tabuada", icon: Grid3X3 },
  { href: "/train", label: "Treinar", icon: Dumbbell },
  { href: "/billing", label: "Planos", icon: CreditCard },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full bg-card shadow-sm border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Mobile hamburger */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-primary"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          MindCalc
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === href
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              )}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right side: Theme toggle + Pro button + User menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Alternar tema"
          >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="block dark:hidden" />
          </button>
          <Link
            href="/billing"
            className="hidden lg:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#14B8A6] transition-colors shadow-sm"
          >
            <Sparkles size={16} />
            Assinar Pro
          </Link>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
