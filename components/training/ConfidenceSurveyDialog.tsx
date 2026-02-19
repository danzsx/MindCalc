"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ConfidenceSurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSubmitted?: () => void;
}

export function ConfidenceSurveyDialog({
  open,
  onOpenChange,
  userId,
  onSubmitted,
}: ConfidenceSurveyDialogProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selected === null) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/confidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, score: selected }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Obrigado pelo feedback!");
      onOpenChange(false);
      onSubmitted?.();
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md border-0 p-8 rounded-[28px]"
        style={{
          background: "rgba(8, 15, 30, 0.95)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(141, 194, 255, 0.15)",
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(141, 194, 255, 0.05)",
        }}
      >
        <DialogHeader className="mb-2">
          <DialogTitle
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-family-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Como você se sente com cálculos?
          </DialogTitle>
          <DialogDescription style={{ color: "var(--color-text-muted)" }}>
            De 1 a 10, qual sua confiança ao fazer contas de cabeça?
          </DialogDescription>
        </DialogHeader>

        <div className="py-5">
          {/* Number grid */}
          <div className="grid grid-cols-5 gap-2.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const isSelected = selected === n;
              return (
                <button
                  key={n}
                  onClick={() => setSelected(n)}
                  className="aspect-square rounded-xl text-lg font-bold transition-all duration-200"
                  style={
                    isSelected
                      ? {
                          background: "rgba(206, 242, 109, 0.14)",
                          border: "2px solid rgba(206, 242, 109, 0.48)",
                          color: "#cef26d",
                          transform: "scale(1.08)",
                          boxShadow: "0 0 18px rgba(206, 242, 109, 0.22)",
                          fontFamily: "var(--font-family-display)",
                        }
                      : {
                          background: "rgba(141, 194, 255, 0.05)",
                          border: "1px solid rgba(141, 194, 255, 0.1)",
                          color: "var(--color-text-muted)",
                          fontFamily: "var(--font-family-display)",
                        }
                  }
                >
                  {n}
                </button>
              );
            })}
          </div>

          {/* Anchor labels */}
          <div className="flex justify-between mt-4 px-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Inseguro
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Confiante
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selected === null || submitting}
          className="w-full px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selected !== null ? "#cef26d" : "rgba(206, 242, 109, 0.1)",
            color: selected !== null ? "#080f1e" : "var(--color-text-muted)",
            boxShadow:
              selected !== null ? "0 4px 24px rgba(206, 242, 109, 0.28)" : "none",
            fontFamily: "var(--font-family-display)",
          }}
        >
          {submitting ? "Salvando..." : "Enviar"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
