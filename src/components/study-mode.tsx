"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";


interface Card {
  id: string;
  front: string;
  back: string;
}

interface StudyModeProps {
  deckId: string;
  deckTitle: string;
  cards: Card[];
}

export function StudyMode({ deckId, deckTitle, cards }: StudyModeProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const current = cards[index];
  const total = cards.length;

  const flip = useCallback(() => setFlipped((f) => !f), []);

  function next() {
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setFlipped(false);
      setTimeout(() => setIndex((i) => i + 1), 150);
    }
  }

  function prev() {
    if (index === 0) return;
    setFlipped(false);
    setTimeout(() => setIndex((i) => i - 1), 150);
  }

  function restart() {
    setFlipped(false);
    setIndex(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-500" />
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          Deck complete!
        </h2>
        <p className="mb-8 text-muted-foreground">
          You reviewed all {total} {total === 1 ? "card" : "cards"} in{" "}
          <span className="text-foreground">{deckTitle}</span>.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={restart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Study Again
          </Button>
          <Link href={`/decks/${deckId}`}>
            <Button>Back to Deck</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/decks/${deckId}`}>
            <Button
              variant="ghost"
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {deckTitle}
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">
            {index + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-1 w-full rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-muted-foreground transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div
          className="relative h-72 cursor-pointer"
          style={{ perspective: "1200px" }}
          onClick={flip}
        >
          <div
            className="relative h-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
                Front
              </p>
              <p className="text-xl font-semibold text-foreground leading-relaxed">
                {current.front}
              </p>
              <p className="mt-8 text-xs text-muted-foreground/40">Click to flip</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-muted p-10 text-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Back
              </p>
              <p className="text-xl font-semibold text-foreground leading-relaxed">
                {current.back}
              </p>
            </div>
          </div>

          {/* Prev arrow — overlaid on left edge */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={index === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 text-muted-foreground backdrop-blur-sm transition hover:bg-accent hover:text-accent-foreground disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous card"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Next arrow — overlaid on right edge */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 text-muted-foreground backdrop-blur-sm transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Next card"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Finish button — only shown on last card */}
        {index + 1 === total && (
          <div className="mt-8 flex justify-center">
            <Button onClick={next}>
              Finish
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
