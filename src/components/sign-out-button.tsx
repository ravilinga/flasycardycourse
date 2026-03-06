"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => signOut(() => router.push("/"))}>
      Sign Out
    </Button>
  );
}
