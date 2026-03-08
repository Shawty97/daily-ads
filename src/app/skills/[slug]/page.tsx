"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface Brand {
  id: string;
  name: string;
}

interface SkillRunResult {
  id: string;
  skill: string;
  input: string;
  output: string;
  createdAt: string;
  brand: { name: string } | null;
}

const SKILL_NAMES: Record<string, string> = {
  "start-here": "Orchestrator",
  "brand-voice": "Brand Voice",
  positioning: "Positioning",
  "keyword-research": "Keyword Research",
  "lead-magnet": "Lead Magnet",
  "direct-response": "Direct Response",
  "seo-content": "SEO Content",
  newsletter: "Newsletter",
  "email-sequences": "Email Sequences",
  "content-atomizer": "Content Atomizer",
};

export default function SkillPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const preselectedBrandId = searchParams.get("brandId") || "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState(preselectedBrandId);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SkillRunResult[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      });
    fetch(`/api/skills/${slug}/history`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      });
  }, [slug]);

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch(`/api/skills/${slug}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: selectedBrandId || undefined,
          input,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Skill-Ausfuehrung fehlgeschlagen");
      }

      const result = await res.json();
      setOutput(result.output);
      setHistory((prev) => [result, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="text-emerald-400 text-sm font-mono">/{slug}</span>
          <h1 className="text-2xl font-bold mt-1">
            {SKILL_NAMES[slug] || slug}
          </h1>
        </div>

        <form onSubmit={handleRun} className="space-y-4 mb-10">
          {/* Brand Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Marke (optional)
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Keine Marke</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Dein Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              required
              placeholder="Beschreibe was du brauchst..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-y"
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
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Wird ausgefuehrt..." : "Skill ausfuehren"}
          </button>
        </form>

        {/* Output */}
        {output && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Ergebnis</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans">
                {output}
              </pre>
            </div>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Letzte Ausfuehrungen
            </h2>
            <div className="space-y-3">
              {history.map((run) => (
                <details
                  key={run.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <summary className="px-4 py-3 cursor-pointer text-sm text-zinc-300 hover:text-white">
                    <span className="text-zinc-500">
                      {new Date(run.createdAt).toLocaleString("de-DE")}
                    </span>
                    {run.brand && (
                      <span className="text-emerald-400 ml-2">
                        {run.brand.name}
                      </span>
                    )}
                    <span className="text-zinc-400 ml-2">
                      — {run.input.slice(0, 80)}...
                    </span>
                  </summary>
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
                    <pre className="whitespace-pre-wrap text-sm text-zinc-400 font-sans">
                      {run.output}
                    </pre>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
