"use server";

import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

const CreateCardSchema = z.object({
  deckId: z.string().uuid(),
  front: z.string().min(1, "Front is required").max(500),
  back: z.string().min(1, "Back is required").max(500),
});

type CreateCardInput = z.infer<typeof CreateCardSchema>;

export async function createCard(input: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { deckId, front, back } = CreateCardSchema.parse(input);

  // Verify ownership before inserting
  const deck = await db.query.decks.findFirst({
    where: and(eq(decks.id, deckId), eq(decks.clerkUserId, userId)),
  });

  if (!deck) throw new Error("Deck not found");

  await db.insert(cards).values({ deckId, front, back });

  revalidatePath(`/decks/${deckId}`);
}

const GenerateCardsSchema = z.object({
  deckId: z.string().uuid(),
});

const FlashcardsSchema = z.object({
  cards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
    })
  ),
});

export async function generateCardsWithAI(input: { deckId: string }) {
  const { userId, has } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const canUseAI = has({ feature: "ai_flash_card_generation" });
  if (!canUseAI) throw new Error("FEATURE_NOT_AVAILABLE");

  const { deckId } = GenerateCardsSchema.parse(input);

  const deck = await db.query.decks.findFirst({
    where: and(eq(decks.id, deckId), eq(decks.clerkUserId, userId)),
  });

  if (!deck) throw new Error("Deck not found");

  const prompt = [
    `Generate exactly 20 flashcards for a deck titled "${deck.title}".`,
    deck.description
      ? `The deck is described as: "${deck.description}".`
      : null,
    "Each card should have a concise question or term on the front and a clear answer or definition on the back.",
    "Cover a broad range of important concepts related to the topic.",
  ]
    .filter(Boolean)
    .join(" ");

  const { output } = await generateText({
    model: openai("gpt-4o"),
    output: Output.object({ schema: FlashcardsSchema }),
    prompt,
  });

  await db.insert(cards).values(
    output.cards.map((card) => ({ deckId, front: card.front, back: card.back }))
  );

  revalidatePath(`/decks/${deckId}`);
}
