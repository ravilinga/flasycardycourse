import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getDeckWithCards } from "@/actions/decks";
import { StudyMode } from "@/components/study-mode";

interface StudyPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { deckId } = await params;
  const deck = await getDeckWithCards({ deckId });

  if (!deck) notFound();
  if (deck.cards.length === 0) redirect(`/decks/${deckId}`);

  return (
    <StudyMode
      deckId={deck.id}
      deckTitle={deck.title}
      cards={deck.cards.map(({ id, front, back }) => ({ id, front, back }))}
    />
  );
}
