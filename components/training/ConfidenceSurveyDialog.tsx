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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Como voce se sente com calculos?</DialogTitle>
          <DialogDescription>
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
                    ? "bg-primary text-primary-foreground shadow-md scale-110"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Anchor labels */}
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-muted-foreground">Inseguro</span>
            <span className="text-xs text-muted-foreground">Confiante</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={selected === null || submitting}
          className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-[#14B8A6] shadow-md transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Salvando..." : "Enviar"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
