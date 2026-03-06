"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CLERK_TIMEOUT_MS = 5000;

export default function Home() {
  const { userId, isLoaded } = useAuth();
  const [clerkTimedOut, setClerkTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded && userId) {
      window.location.replace("/dashboard");
    }
  }, [userId, isLoaded]);

  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setClerkTimedOut(true), CLERK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (clerkTimedOut) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-8 py-6 text-center dark:border-amber-800 dark:bg-amber-950">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
            Authentication Unavailable
          </h2>
          <p className="max-w-sm text-sm text-amber-700 dark:text-amber-300">
            We&apos;re having trouble connecting to our authentication service.
            Please check your connection or try again in a moment.
          </p>
          <Button
            variant="outline"
            className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded || userId) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-black">
      <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        FlashyCardy
      </h1>
      <p className="text-xl text-zinc-500 dark:text-zinc-400">
        Your Personal Flashcard Platform
      </p>
      <div className="flex gap-4">
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
