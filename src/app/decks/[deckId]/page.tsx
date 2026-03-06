import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getDeckWithCards } from "@/actions/decks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCardDialog } from "@/components/add-card-dialog";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import { GenerateCardsButton } from "@/components/generate-cards-button";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";

interface DeckPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId, has } = await auth();
  if (!userId) redirect("/");

  const hasAIFeature = has({ feature: "ai_flash_card_generation" });

  const { deckId } = await params;
  const deck = await getDeckWithCards({ deckId });

  if (!deck) notFound();

  const cardCount = deck.cards.length;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Layers className="mt-0.5 h-7 w-7 shrink-0 text-muted-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {deck.title}
                </h1>
                {deck.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {deck.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {cardCount} {cardCount === 1 ? "card" : "cards"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              {cardCount > 0 && (
                <Link href={`/decks/${deckId}/study`}>
                  <Button variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study
                  </Button>
                </Link>
              )}
              <EditDeckDialog
                deckId={deckId}
                initialTitle={deck.title}
                initialDescription={deck.description}
              />
              <GenerateCardsButton deckId={deckId} hasAIFeature={hasAIFeature} hasDescription={!!deck.description?.trim()} />
              <AddCardDialog deckId={deckId} />
            </div>
          </div>
        </div>

        {/* Cards */}
        {cardCount === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
            <p className="mb-2 text-lg font-medium text-muted-foreground">
              No cards yet
            </p>
            <p className="mb-6 text-sm text-muted-foreground/70">
              Add your first flashcard to start studying
            </p>
            <AddCardDialog deckId={deckId} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deck.cards.map((card, index) => (
              <Card
                key={card.id}
                className="group border-border bg-card transition-colors hover:border-input hover:bg-muted/50"
              >
                <CardHeader className="pb-2">
                  <p className="text-xs text-muted-foreground/70">Card {index + 1}</p>
                  <CardTitle className="text-base font-semibold text-foreground leading-snug">
                    {card.front}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 group-hover:border-input">
                    <p className="text-sm text-muted-foreground">{card.back}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
