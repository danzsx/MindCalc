"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
          {initial}
        </div>
        <span className="hidden sm:inline max-w-[150px] truncate text-sm text-white/80">
          {user?.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">Minha Conta</p>
            <p className="text-xs text-white/50 truncate">
              {user?.email}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/5"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
