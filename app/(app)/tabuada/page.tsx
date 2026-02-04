"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { TablesConfigForm } from "@/components/tables/TablesConfigForm";
import type { TablesConfig } from "@/types";

export default function TabuadaPage() {
  const router = useRouter();

  const handleStart = useCallback(
    (config: TablesConfig) => {
      const params = new URLSearchParams({
        op: config.operation,
        min: String(config.range.min),
        max: String(config.range.max),
        mode: config.mode,
      });
      router.push(`/tabuada/session?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] max-w-md w-full zoom-in-95">
        <h1
          className="text-2xl font-semibold text-foreground mb-1"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Tabuada
        </h1>
        <p className="text-muted-foreground mb-6">
          Pratique as operações no seu ritmo, sem pressa.
        </p>

        <TablesConfigForm onStart={handleStart} />
      </div>
    </div>
  );
}
