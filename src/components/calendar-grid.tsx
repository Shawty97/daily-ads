"use client";

import type { CalendarDay } from "@/types/calendar";

interface CalendarGridProps {
  year: number;
  month: number;
  days: CalendarDay[];
  onDayClick: (date: string) => void;
  selectedDate: string | null;
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MONTH_NAMES = [
  "Januar",
  "Februar",
  "Maerz",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  // 0 = Sunday in JS, we want Monday = 0
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarGrid({
  year,
  month,
  days,
  onDayClick,
  selectedDate,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  const today = new Date().toISOString().split("T")[0];

  // Build a map for quick lookup
  const dayMap = new Map<string, CalendarDay>();
  for (const d of days) {
    dayMap.set(d.date, d);
  }

  const cells: (number | null)[] = [];
  // Empty cells before first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">
        {MONTH_NAMES[month - 1]} {year}
      </h2>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-xs text-zinc-500 font-medium py-2"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateKey = formatDateKey(year, month, day);
          const dayData = dayMap.get(dateKey);
          const isToday = dateKey === today;
          const isSelected = dateKey === selectedDate;
          const isFuture = dateKey > today;
          const hasAds = dayData && dayData.count > 0;

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick(dateKey)}
              className={`
                aspect-square rounded-lg border p-1.5 flex flex-col items-start justify-between
                transition-all text-left relative overflow-hidden
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50"
                    : hasAds
                      ? "border-zinc-700 bg-zinc-900 hover:border-emerald-500/50 hover:bg-zinc-800/80"
                      : isFuture
                        ? "border-zinc-800/50 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/50"
                        : "border-zinc-800/50 bg-zinc-950/50 hover:border-zinc-700"
                }
              `}
            >
              <span
                className={`text-xs font-medium ${
                  isToday
                    ? "text-emerald-400"
                    : isSelected
                      ? "text-emerald-300"
                      : "text-zinc-400"
                }`}
              >
                {day}
                {isToday && (
                  <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </span>

              {hasAds && (
                <div className="w-full">
                  <span className="text-[10px] font-bold text-emerald-400">
                    {dayData.count} Ad{dayData.count > 1 ? "s" : ""}
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {dayData.formats.slice(0, 3).map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[8px] px-1 rounded bg-zinc-800 text-zinc-500 truncate max-w-full"
                      >
                        {fmt}
                      </span>
                    ))}
                    {dayData.formats.length > 3 && (
                      <span className="text-[8px] text-zinc-600">
                        +{dayData.formats.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isFuture && !hasAds && (
                <div className="w-full">
                  <span className="text-[9px] text-zinc-700">--</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
