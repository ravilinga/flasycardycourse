"use server";

import { db } from "@/db";
import { decks } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getDecks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(decks)
    .where(eq(decks.clerkUserId, userId))
    .orderBy(decks.createdAt);
}
