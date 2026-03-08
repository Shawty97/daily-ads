"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const TIME_OPTIONS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "12:00",
  "18:00",
  "20:00",
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [digestTime, setDigestTime] = useState("08:00");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/settings/email-preferences")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.digestEnabled === "boolean") {
          setDigestEnabled(data.digestEnabled);
        }
        if (typeof data.digestTime === "string") {
          setDigestTime(data.digestTime);
        }
      })
      .finally(() => setLoading(false));
  }, [status]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/email-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digestEnabled, digestTime }),
      });
      if (!res.ok) return;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <>
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center text-zinc-500">
          Laden...
        </div>
      </>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Einstellungen</h1>

        {/* Email Digest Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">Email Digest</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Erhalte taeglich eine Zusammenfassung deiner neuen Ad Creatives per
            Email.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Taeglicher Digest
              </p>
              <p className="text-xs text-zinc-500">
                Neue Ads der letzten 24 Stunden
              </p>
            </div>
            <button
              onClick={() => setDigestEnabled(!digestEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                digestEnabled ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  digestEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Time Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Uhrzeit
            </label>
            <select
              value={digestTime}
              onChange={(e) => setDigestTime(e.target.value)}
              disabled={!digestEnabled}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t} Uhr
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              {saving ? "Speichern..." : "Speichern"}
            </button>
            {saved && (
              <span className="text-sm text-emerald-400">Gespeichert!</span>
            )}
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Name
              </p>
              <p className="text-sm text-zinc-200">
                {session.user.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm text-zinc-200">
                {session.user.email || "—"}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
