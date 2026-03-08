"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface Brand {
  id: string;
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  _count: { adCreatives: number; skillRuns: number };
}

interface Ad {
  id: string;
  format: string;
  hook: string;
  createdAt: string;
  brand: { name: string };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/brands")
      .then((r) => r.json())
      .then(setBrands);
    fetch("/api/ads?limit=10")
      .then((r) => r.json())
      .then(setAds);
  }, [status]);

  if (status === "loading") {
    return (
      <>
        <Nav />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-zinc-500">
          Laden...
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Nav />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-zinc-400 mb-4">
            Melde dich an um dein Dashboard zu sehen.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link
            href="/brands/new"
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors"
          >
            + Marke hinzufuegen
          </Link>
        </div>

        {/* Brands */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Deine Marken</h2>
          {brands.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-500 mb-4">
                Noch keine Marken angelegt.
              </p>
              <Link
                href="/brands/new"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Erste Marke analysieren &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
                >
                  <h3 className="font-semibold text-white mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">{brand.url}</p>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                    {brand.description}
                  </p>
                  <div className="flex gap-4 text-xs text-zinc-500">
                    <span>{brand._count.adCreatives} Ads</span>
                    <span>{brand._count.skillRuns} Skill Runs</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Ads */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Letzte Ad Creatives</h2>
            <Link
              href="/ads"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Alle ansehen &rarr;
            </Link>
          </div>
          {ads.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              Noch keine Ads generiert.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-emerald-400 uppercase">
                      {ad.format}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {ad.brand.name}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium">{ad.hook}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
