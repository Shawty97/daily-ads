"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AdSwipe } from "@/components/ad-swipe";

interface SwipeAd {
  id: string;
  format: string;
  hook: string;
  body: string;
  cta: string | null;
  imageUrl: string | null;
  brand: { name: string; url: string };
}

export default function SwipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState<SwipeAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/ads?unrated=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAds(data);
      })
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <>
        <Nav />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-zinc-500">
          Laden...
        </div>
      </>
    );
  }

  if (!session?.user) return null;

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2 text-center">Ad Swipe</h1>
        <p className="text-sm text-zinc-500 text-center mb-8">
          Bewerte deine Ads — Like oder Skip
        </p>

        {ads.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            Keine unbewerteten Ads vorhanden.
          </div>
        ) : (
          <AdSwipe ads={ads} />
        )}
      </main>
      <Footer />
    </>
  );
}
