"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-white">
          Daily Ads
        </Link>

        <div className="flex items-center gap-6">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/ads"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Ads
              </Link>
              <Link
                href="/swipe"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Swipe
              </Link>
              <Link
                href="/skills"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Skills
              </Link>
              <Link
                href="/settings"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Abmelden
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-sm bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Anmelden
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
