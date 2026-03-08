"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface BrandResult {
  id: string;
  name: string;
  url: string;
  description: string | null;
  voice: string | null;
  positioning: string | null;
  audience: string | null;
  usps: string[];
  colors: string[];
}

export default function NewBrandPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BrandResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analyse fehlgeschlagen");
      }

      const brand = await res.json();
      setResult(brand);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Marke analysieren</h1>
        <p className="text-zinc-400 mb-8">
          Gib die URL deiner Website ein. Unsere KI analysiert automatisch
          Brand Voice, Positioning, Zielgruppe und USPs.
        </p>

        {!result ? (
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Website URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://deine-website.de"
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analysiere..." : "Marke analysieren"}
            </button>

            {loading && (
              <p className="text-sm text-zinc-500 text-center">
                Die Analyse dauert ca. 10-20 Sekunden...
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{result.name}</h2>
                <div className="flex gap-2">
                  {result.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-zinc-700"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-zinc-500 mb-4">{result.url}</p>

              {result.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                    Beschreibung
                  </h3>
                  <p className="text-sm text-zinc-400">{result.description}</p>
                </div>
              )}

              {result.voice && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                    Brand Voice
                  </h3>
                  <p className="text-sm text-zinc-400">{result.voice}</p>
                </div>
              )}

              {result.positioning && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                    Positioning
                  </h3>
                  <p className="text-sm text-zinc-400">{result.positioning}</p>
                </div>
              )}

              {result.audience && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                    Zielgruppe
                  </h3>
                  <p className="text-sm text-zinc-400">{result.audience}</p>
                </div>
              )}

              {result.usps.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                    USPs
                  </h3>
                  <ul className="list-disc list-inside text-sm text-zinc-400">
                    {result.usps.map((usp, i) => (
                      <li key={i}>{usp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/brands/${result.id}`)}
                className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
              >
                Zur Marke &rarr;
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setUrl("");
                }}
                className="px-6 py-3 border border-zinc-700 rounded-lg text-zinc-300 hover:border-zinc-600 transition-colors"
              >
                Weitere Marke
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
