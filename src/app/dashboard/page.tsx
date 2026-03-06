import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDecks } from "@/actions/decks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const decks = await getDecks();

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-7 w-7 text-zinc-400" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-50">My Decks</h1>
              <p className="text-sm text-zinc-500">
                {decks.length} {decks.length === 1 ? "deck" : "decks"}
              </p>
            </div>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Deck
          </Button>
        </div>

        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-24 text-center">
            <p className="mb-2 text-lg font-medium text-zinc-400">
              No decks yet
            </p>
            <p className="mb-6 text-sm text-zinc-600">
              Create your first deck to get started
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Deck
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-600 hover:bg-zinc-800/80 cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-zinc-50">{deck.title}</CardTitle>
                  {deck.description && (
                    <CardDescription className="text-zinc-500 line-clamp-2">
                      {deck.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-zinc-600">
                    Created{" "}
                    {new Date(deck.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
