"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CalendarGrid } from "@/components/calendar-grid";
import type { CalendarDay } from "@/types/calendar";

interface CalendarStats {
  totalAds: number;
  formatCounts: Record<string, number>;
  activeBrands: string[];
}

interface DayAd {
  id: string;
  format: string;
  hook: string;
  body: string;
  cta: string | null;
  createdAt: string;
  brand: { name: string; url: string };
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayAds, setDayAds] = useState<DayAd[]>([]);
  const [loadingAds, setLoadingAds] = useState(false);

  const fetchCalendar = useCallback(async () => {
    const res = await fetch(`/api/ads/calendar?year=${year}&month=${month}`);
    if (res.ok) {
      const data = await res.json();
      setDays(data.days);
      setStats(data.stats);
    }
  }, [year, month]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCalendar();
    }
  }, [status, fetchCalendar]);

  async function handleDayClick(date: string) {
    setSelectedDate(date);
    setLoadingAds(true);

    try {
      const res = await fetch(`/api/ads?date=${date}`);
      if (res.ok) {
        const ads: DayAd[] = await res.json();
        setDayAds(ads);
      }
    } finally {
      setLoadingAds(false);
    }
  }

  function goToPreviousMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setDayAds([]);
  }

  function goToNextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setDayAds([]);
  }

  function goToToday() {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    handleDayClick(todayStr);
  }

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
            Melde dich an um den Kalender zu sehen.
          </p>
        </div>
      </>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const selectedIsFuture = selectedDate ? selectedDate > today : false;
  const selectedDayData = days.find((d) => d.date === selectedDate);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Kampagnen-Kalender</h1>
            <p className="text-sm text-zinc-500 mt-1">
              30-Tage Content-Plan und Ad-Uebersicht
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            &larr; Dashboard
          </Link>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-emerald-400">
                {stats.totalAds}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Ads diesen Monat</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-white">
                {Object.keys(stats.formatCounts).length}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Formate genutzt</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-white">
                {stats.activeBrands.length}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Marken aktiv</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-white">{days.length}</p>
              <p className="text-xs text-zinc-500 mt-1">Tage mit Content</p>
            </div>
          </div>
        )}

        {/* Format Breakdown */}
        {stats && Object.keys(stats.formatCounts).length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              Format-Verteilung
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.formatCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([format, count]) => (
                  <span
                    key={format}
                    className="px-3 py-1 rounded-full text-xs border border-zinc-700 text-zinc-400"
                  >
                    {format}{" "}
                    <span className="text-emerald-400 font-medium">
                      {count}
                    </span>
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            {/* Month Navigation */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={goToPreviousMonth}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm"
              >
                &larr;
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm"
              >
                Heute
              </button>
              <button
                onClick={goToNextMonth}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm"
              >
                &rarr;
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <CalendarGrid
                year={year}
                month={month}
                days={days}
                onDayClick={handleDayClick}
                selectedDate={selectedDate}
              />
            </div>
          </div>

          {/* Day Detail Sidebar */}
          <div className="lg:col-span-1">
            {selectedDate ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sticky top-20">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "de-DE",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }
                  )}
                </h3>

                {selectedDayData && (
                  <div className="flex gap-2 mb-4 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {selectedDayData.count} Ad
                      {selectedDayData.count > 1 ? "s" : ""}
                    </span>
                    {selectedDayData.brands.map((b) => (
                      <span
                        key={b}
                        className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                {selectedIsFuture && (
                  <div className="mb-4">
                    <p className="text-sm text-zinc-500 mb-3">
                      Fuer diesen Tag Ads planen:
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-block bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors"
                    >
                      Ads generieren
                    </Link>
                  </div>
                )}

                {loadingAds ? (
                  <p className="text-sm text-zinc-500">Laden...</p>
                ) : dayAds.length > 0 ? (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {dayAds.map((ad) => (
                      <div
                        key={ad.id}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-medium">
                            {ad.format}
                          </span>
                          <span className="text-[10px] text-zinc-600">
                            {ad.brand.name}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white mb-1">
                          {ad.hook}
                        </p>
                        <p className="text-xs text-zinc-500 line-clamp-2">
                          {ad.body}
                        </p>
                        {ad.cta && (
                          <p className="text-xs text-emerald-400/70 mt-1">
                            {ad.cta}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : !selectedIsFuture ? (
                  <p className="text-sm text-zinc-500">
                    Keine Ads an diesem Tag.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                <p className="text-sm text-zinc-500">
                  Waehle einen Tag um Details zu sehen.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
