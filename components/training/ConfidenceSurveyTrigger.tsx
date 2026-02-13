"use client";

import { useState, useEffect } from "react";
import { ConfidenceSurveyDialog } from "./ConfidenceSurveyDialog";

interface ConfidenceSurveyTriggerProps {
  userId: string;
}

export function ConfidenceSurveyTrigger({ userId }: ConfidenceSurveyTriggerProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/confidence?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        if (data.shouldShow) {
          setOpen(true);
        }
      } catch {
        // Silently fail — survey is non-critical
      } finally {
        setChecked(true);
      }
    }, 1000); // 1s delay before checking

    return () => clearTimeout(timer);
  }, [userId, checked]);

  if (!checked) return null;

  return (
    <ConfidenceSurveyDialog
      open={open}
      onOpenChange={setOpen}
      userId={userId}
    />
  );
}
