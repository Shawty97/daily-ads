"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PlatformMockupSelector } from "@/components/ad-mockups";

interface HookVariant {
  type: string;
  text: string;
}

interface Ad {
  id: string;
  format: string;
  hook: string;
  body: string;
  cta: string | null;
  imageUrl: string | null;
  hookVariants: HookVariant[] | null;
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

const HOOK_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  curiosity: { label: "Neugier", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  "pain-point": { label: "Schmerzpunkt", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  benefit: { label: "Vorteil", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
};

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filterFormat, setFilterFormat] = useState("");
  const [expandedAd, setExpandedAd] = useState<string | null>(null);

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

  function toggleExpanded(adId: string) {
    setExpandedAd((prev) => (prev === adId ? null : adId));
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
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
              >
                {/* Ad Image */}
                {ad.imageUrl && (
                  <div className="relative aspect-video bg-zinc-800">
                    <Image
                      src={ad.imageUrl}
                      alt={ad.hook}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="p-5">
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

                  {/* Hook Variants (B3) */}
                  {ad.hookVariants && ad.hookVariants.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                        Hook-Varianten
                      </p>
                      <div className="space-y-1.5">
                        {ad.hookVariants.map((variant, idx) => {
                          const meta = HOOK_TYPE_LABELS[variant.type] ?? {
                            label: variant.type,
                            color: "text-zinc-400 bg-zinc-800 border-zinc-700",
                          };
                          return (
                            <div key={idx} className="flex items-start gap-2">
                              <span
                                className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium border ${meta.color}`}
                              >
                                {meta.label}
                              </span>
                              <span className="text-sm text-zinc-300">
                                {variant.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 mb-3">
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
                    <button
                      onClick={() => toggleExpanded(ad.id)}
                      className="ml-auto px-3 py-1 rounded text-xs border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      {expandedAd === ad.id ? "Mockup schliessen" : "Plattform-Preview"}
                    </button>
                  </div>

                  {/* Platform Mockup (B2) */}
                  {expandedAd === ad.id && (
                    <div className="pt-3 border-t border-zinc-800">
                      <PlatformMockupSelector
                        headline={ad.hook}
                        body={ad.body}
                        imageUrl={ad.imageUrl}
                        brandName={ad.brand.name}
                        ctaText={ad.cta ?? undefined}
                      />
                    </div>
                  )}
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
