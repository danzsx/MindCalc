"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Grid3X3, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Painel",  icon: LayoutDashboard },
  { href: "/lessons",   label: "Aulas",   icon: BookOpen },
  { href: "/tabuada",   label: "Tabuada", icon: Grid3X3 },
  { href: "/train",     label: "Treinar", icon: Dumbbell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed left-4 right-4 z-50"
      style={{
        // Respect iOS home indicator via safe-area-inset — fixes keyboard/URL bar conflict
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Navegação principal"
    >
      <div
        className="flex items-center justify-around px-2 py-1.5 rounded-[2rem]"
        style={{
          background: "rgba(8, 15, 30, 0.95)",
          border: "1px solid rgba(141, 194, 255, 0.12)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow:
            "0 -4px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(141, 194, 255, 0.06)",
        }}
      >
        {mobileNavItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href + "/"));

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#cef26d] min-w-[60px]",
                !isActive && "opacity-50 hover:opacity-75"
              )}
            >
              {/* Icon container — highlighted when active */}
              <div
                className="p-2 rounded-xl transition-all duration-300"
                style={
                  isActive
                    ? {
                        background: "rgba(55, 112, 191, 0.2)",
                        boxShadow: "0 0 14px rgba(55, 112, 191, 0.18)",
                      }
                    : {}
                }
              >
                <Icon
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ color: isActive ? "#8dc2ff" : "#6b89b4" }}
                />
              </div>

              {/* Label — only visible when active */}
              {isActive && (
                <span
                  className="text-[9px] font-semibold tracking-widest leading-none uppercase"
                  style={{ color: "#cef26d" }}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
