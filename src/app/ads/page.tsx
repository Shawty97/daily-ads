"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface Ad {
  id: string;
  format: string;
  hook: string;
  body: string;
  cta: string | null;
  feedback: number | null;
  createdAt: string;
  brand: { name: string; url: string };
}

const AD_FORMATS = [
  "meme",
  "fake-text",
  "stat-card",
  "ugc",
  "napkin-math",
  "tweet-screenshot",
  "slack-screenshot",
  "linkedin",
];

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filterFormat, setFilterFormat] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterFormat) params.set("format", filterFormat);
    fetch(`/api/ads?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAds(data);
      });
  }, [filterFormat]);

  async function handleFeedback(adId: string, feedback: number) {
    await fetch(`/api/ads/${adId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, feedback } : ad))
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Ad Creatives</h1>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilterFormat("")}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              !filterFormat
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            Alle
          </button>
          {AD_FORMATS.map((format) => (
            <button
              key={format}
              onClick={() => setFilterFormat(format)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                filterFormat === format
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Ads Grid */}
        {ads.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            Keine Ads gefunden.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-emerald-400 uppercase tracking-wider">
                    {ad.format}
                  </span>
                  <span className="text-xs text-zinc-600">{ad.brand.name}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{ad.hook}</h3>
                <p className="text-sm text-zinc-400 whitespace-pre-line mb-3">
                  {ad.body}
                </p>
                {ad.cta && (
                  <p className="text-sm text-emerald-400 mb-3">
                    CTA: {ad.cta}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(ad.id, 1)}
                    className={`p-1.5 rounded transition-colors ${
                      ad.feedback === 1
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-zinc-500 hover:text-emerald-400"
                    }`}
                  >
                    &#x1F44D;
                  </button>
                  <button
                    onClick={() => handleFeedback(ad.id, -1)}
                    className={`p-1.5 rounded transition-colors ${
                      ad.feedback === -1
                        ? "bg-red-500/20 text-red-400"
                        : "text-zinc-500 hover:text-red-400"
                    }`}
                  >
                    &#x1F44E;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
