import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDecks } from "@/actions/decks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AddDeckDialog } from "@/components/add-deck-dialog";
import { LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const { userId, has } = await auth();
  if (!userId) redirect("/");

  const decks = await getDecks();

  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });
  const isAtLimit = !hasUnlimitedDecks && decks.length >= 5;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {isAtLimit && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You&apos;ve reached the 5-deck limit on the free plan.
            </p>
            <Link
              href="/pricing"
              className="ml-4 shrink-0 text-sm font-medium text-amber-700 dark:text-amber-300 underline-offset-4 hover:underline"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-7 w-7 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Decks</h1>
              <p className="text-sm text-muted-foreground">
                {decks.length} {decks.length === 1 ? "deck" : "decks"}
                {!hasUnlimitedDecks && (
                  <span className="ml-1 opacity-60">/ 5</span>
                )}
              </p>
            </div>
          </div>
          <AddDeckDialog limitReached={isAtLimit} />
        </div>

        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
            <p className="mb-2 text-lg font-medium text-muted-foreground">
              No decks yet
            </p>
            <p className="mb-6 text-sm text-muted-foreground/70">
              Create your first deck to get started
            </p>
            <AddDeckDialog limitReached={isAtLimit} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Link key={deck.id} href={`/decks/${deck.id}`} className="flex">
                <Card className="flex flex-col w-full border-border bg-card transition-colors hover:border-input hover:bg-muted/50 cursor-pointer">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-foreground">{deck.title}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {deck.description ?? ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground/70">
                      Updated:{" "}
                      {new Date(deck.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
