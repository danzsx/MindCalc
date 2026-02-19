"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import { NumetriaLogo } from "./NumetriaLogo";
import { LayoutDashboard, BookOpen, Grid3X3, Dumbbell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "motion/react";

export const navLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/lessons",   label: "Aulas",  icon: BookOpen },
  { href: "/tabuada",   label: "Tabuada", icon: Grid3X3 },
  { href: "/train",     label: "Treinar", icon: Dumbbell },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 hidden md:block"
      style={{
        background: "var(--glass-navbar-bg, rgba(8, 15, 30, 0.85))",
        borderBottom: "1px solid var(--glass-navbar-border, rgba(141, 194, 255, 0.08))",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        boxShadow: "0 1px 0 rgba(141, 194, 255, 0.06)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#cef26d]"
        >
          <NumetriaLogo variant="full" size={28} color="light" />
          {isAdmin && (
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ color: "#cef26d", background: "rgba(206, 242, 109, 0.1)" }}
            >
              Admin
            </span>
          )}
        </Link>

        {/* Center nav pills */}
        <div
          className="flex items-center gap-1 p-1.5 rounded-2xl"
          style={{
            background: "rgba(13, 29, 58, 0.6)",
            border: "1px solid rgba(141, 194, 255, 0.08)",
          }}
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/"));

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#cef26d]",
                  isActive ? "text-white" : "text-[#6b89b4] hover:text-[#a8c0e0]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: "rgba(55, 112, 191, 0.15)",
                      border: "1px solid rgba(55, 112, 191, 0.4)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    isActive ? "text-[#8dc2ff]" : "text-[#6b89b4]"
                  )}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side — Upgrade CTA + divider + UserMenu */}
        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-px outline-none focus-visible:ring-2 focus-visible:ring-[#cef26d]"
            style={{
              background: "#cef26d",
              color: "#080f1e",
              boxShadow: "0 4px 16px rgba(206, 242, 109, 0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 8px 24px rgba(206, 242, 109, 0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 4px 16px rgba(206, 242, 109, 0.2)";
            }}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upgrade</span>
          </Link>

          <div
            className="hidden lg:block h-6 w-px"
            style={{ background: "rgba(141, 194, 255, 0.1)" }}
          />

          <UserMenu />
        </div>
      </div>
    </motion.nav>
  );
}
