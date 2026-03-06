"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateCardsWithAI } from "@/actions/cards";

interface GenerateCardsButtonProps {
  deckId: string;
  hasAIFeature: boolean;
  hasDescription: boolean;
}

export function GenerateCardsButton({
  deckId,
  hasAIFeature,
  hasDescription,
}: GenerateCardsButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleGenerate() {
    if (!hasAIFeature) {
      router.push("/pricing");
      return;
    }

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await generateCardsWithAI({ deckId });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        setError("Generation failed. Please try again.");
        setTimeout(() => setError(null), 4000);
      }
    });
  }

  const tooltipMessage = !hasAIFeature
    ? "AI generation is a Pro feature. Click to upgrade."
    : !hasDescription
      ? "Add a description to your deck to enable AI generation."
      : null;

  const isDisabled = isPending || (hasAIFeature && !hasDescription);

  const trigger = (
    // span wrapper keeps the tooltip hoverable on disabled buttons
    <span className={isDisabled ? "cursor-not-allowed" : undefined}>
      <Button
        onClick={handleGenerate}
        disabled={isDisabled}
        variant="outline"
        className={
          hasAIFeature
            ? "border-violet-500/60 text-violet-600 dark:text-violet-300 hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-100 disabled:pointer-events-none disabled:opacity-40"
            : "border-border text-muted-foreground hover:bg-muted hover:text-muted-foreground"
        }
      >
        {hasAIFeature ? (
          <Sparkles className="mr-2 h-4 w-4" />
        ) : (
          <Lock className="mr-2 h-4 w-4" />
        )}
        {isPending
          ? "Generating…"
          : success
            ? "20 cards added!"
            : "Generate with AI"}
      </Button>
    </span>
  );

  return (
    <div className="flex flex-col items-end gap-1">
      {tooltipMessage ? (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="max-w-[220px] text-center"
          >
            {tooltipMessage}
          </TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
