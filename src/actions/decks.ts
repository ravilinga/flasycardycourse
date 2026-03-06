"use server";

import { db } from "@/db";
import { decks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getDecks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(decks)
    .where(eq(decks.clerkUserId, userId))
    .orderBy(decks.createdAt);
}

const CreateDeckSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type CreateDeckInput = z.infer<typeof CreateDeckSchema>;

export async function createDeck(input: CreateDeckInput) {
  const { userId, has } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });

  if (!hasUnlimitedDecks) {
    const existing = await db
      .select({ id: decks.id })
      .from(decks)
      .where(eq(decks.clerkUserId, userId));

    if (existing.length >= 5) {
      throw new Error("DECK_LIMIT_REACHED");
    }
  }

  const { title, description } = CreateDeckSchema.parse(input);

  await db.insert(decks).values({ clerkUserId: userId, title, description });

  revalidatePath("/dashboard");
}

const UpdateDeckSchema = z.object({
  deckId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;

export async function updateDeck(input: UpdateDeckInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { deckId, title, description } = UpdateDeckSchema.parse(input);

  const existing = await db.query.decks.findFirst({
    where: and(eq(decks.id, deckId), eq(decks.clerkUserId, userId)),
  });

  if (!existing) throw new Error("Deck not found");

  await db
    .update(decks)
    .set({ title, description, updatedAt: new Date() })
    .where(and(eq(decks.id, deckId), eq(decks.clerkUserId, userId)));

  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");
}

const GetDeckSchema = z.object({
  deckId: z.string().uuid(),
});

export async function getDeckWithCards(input: { deckId: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { deckId } = GetDeckSchema.parse(input);

  const deck = await db.query.decks.findFirst({
    where: and(eq(decks.id, deckId), eq(decks.clerkUserId, userId)),
    with: { cards: { orderBy: (cards, { asc }) => [asc(cards.createdAt)] } },
  });

  return deck ?? null;
}
