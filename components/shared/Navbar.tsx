"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import {
  LayoutDashboard,
  BookOpen,
  Grid3X3,
  Dumbbell,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "motion/react";

export const navLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/lessons", label: "Aulas", icon: BookOpen },
  { href: "/tabuada", label: "Tabuada", icon: Grid3X3 },
  { href: "/train", label: "Treinar", icon: Dumbbell },
  { href: "/billing", label: "Planos", icon: CreditCard },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 hidden md:block bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-50" />
            <div className="relative bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 rounded-2xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              MindCalc
            </span>
            {isAdmin && (
              <span className="ml-2 text-xs font-medium text-teal-400">
                Admin
              </span>
            )}
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-teal-500/25"
          >
            Assinar Pro
          </Link>
          <UserMenu />
        </div>
      </div>
    </motion.nav>
  );
}
