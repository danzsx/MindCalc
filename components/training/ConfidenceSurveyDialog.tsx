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
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl text-white">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Como voce se sente com calculos?
          </DialogTitle>
          <DialogDescription className="text-white/60">
            De 1 a 10, qual sua confianca ao fazer contas de cabeca?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* 2 rows of 5 buttons */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setSelected(n)}
                className={`aspect-square rounded-xl text-lg font-bold transition-all duration-200 ${
                  selected === n
                    ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-110"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Anchor labels */}
          <div className="flex justify-between mt-3 px-1">
            <span className="text-xs text-white/40">Inseguro</span>
            <span className="text-xs text-white/40">Confiante</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={selected === null || submitting}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {submitting ? "Salvando..." : "Enviar"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
