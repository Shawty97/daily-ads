"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
}

interface Brand {
  id: string;
  name: string;
  url: string;
  description: string | null;
  voice: string | null;
  positioning: string | null;
  audience: string | null;
  usps: string[];
  colors: string[];
  adCreatives: Ad[];
  _count: { adCreatives: number; skillRuns: number };
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

export default function BrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [expandedAd, setExpandedAd] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/brands/${id}`)
      .then((r) => r.json())
      .then(setBrand);
  }, [id]);

  async function handleGenerate() {
    if (!brand) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: brand.id,
          count: selectedFormats.length || 4,
          formats: selectedFormats.length > 0 ? selectedFormats : undefined,
        }),
      });
      if (res.ok) {
        // Reload brand to get new ads
        const updated = await fetch(`/api/brands/${id}`).then((r) => r.json());
        setBrand(updated);
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleFeedback(adId: string, feedback: number) {
    await fetch(`/api/ads/${adId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });
    // Update local state
    if (brand) {
      setBrand({
        ...brand,
        adCreatives: brand.adCreatives.map((ad) =>
          ad.id === adId ? { ...ad, feedback } : ad
        ),
      });
    }
  }

  function toggleFormat(format: string) {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  }

  function toggleExpanded(adId: string) {
    setExpandedAd((prev) => (prev === adId ? null : adId));
  }

  if (!brand) {
    return (
      <>
        <Nav />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-zinc-500">
          Laden...
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Brand Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{brand.name}</h1>
            <p className="text-sm text-zinc-500">{brand.url}</p>
          </div>
          <div className="flex gap-2">
            {brand.colors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-zinc-700"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Brand Info Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {brand.description && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                Beschreibung
              </h3>
              <p className="text-sm text-zinc-400">{brand.description}</p>
            </div>
          )}
          {brand.voice && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                Brand Voice
              </h3>
              <p className="text-sm text-zinc-400">{brand.voice}</p>
            </div>
          )}
          {brand.positioning && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                Positioning
              </h3>
              <p className="text-sm text-zinc-400">{brand.positioning}</p>
            </div>
          )}
          {brand.audience && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                Zielgruppe
              </h3>
              <p className="text-sm text-zinc-400">{brand.audience}</p>
            </div>
          )}
        </div>

        {/* Generate Ads */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Ads generieren</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm text-zinc-400 mb-4">
              Waehle Formate (oder lasse leer fuer alle):
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {AD_FORMATS.map((format) => (
                <button
                  key={format}
                  onClick={() => toggleFormat(format)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    selectedFormats.includes(format)
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              {generating ? "Generiere..." : "Ads generieren"}
            </button>
          </div>
        </section>

        {/* Ad Creatives */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Ad Creatives ({brand._count.adCreatives})
          </h2>
          {brand.adCreatives.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Noch keine Ads generiert.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {brand.adCreatives.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                >
                  {/* Ad Image (B1) */}
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
                    <div className="text-xs text-emerald-400 uppercase tracking-wider mb-2">
                      {ad.format}
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

                    {/* Actions */}
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
                          brandName={brand.name}
                          ctaText={ad.cta ?? undefined}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Skills ausfuehren</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "brand-voice",
              "positioning",
              "keyword-research",
              "lead-magnet",
              "direct-response",
              "seo-content",
              "newsletter",
              "email-sequences",
              "content-atomizer",
            ].map((skill) => (
              <Link
                key={skill}
                href={`/skills/${skill}?brandId=${brand.id}`}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
              >
                /{skill}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
