import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { CalendarDay } from "@/types/calendar";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yearParam = req.nextUrl.searchParams.get("year");
  const monthParam = req.nextUrl.searchParams.get("month");

  const now = new Date();
  const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam, 10) : now.getMonth() + 1;

  if (
    isNaN(year) || year < 2020 || year > 2100 ||
    isNaN(month) || month < 1 || month > 12
  ) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }

  // Start and end of month (UTC)
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const ads = await prisma.adCreative.findMany({
    where: {
      brand: { userId: session.user.id },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      id: true,
      format: true,
      createdAt: true,
      brand: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const dayMap = new Map<string, { formats: Set<string>; brands: Set<string>; count: number }>();

  for (const ad of ads) {
    const dateKey = ad.createdAt.toISOString().split("T")[0];
    const existing = dayMap.get(dateKey);
    if (existing) {
      existing.count++;
      existing.formats.add(ad.format);
      existing.brands.add(ad.brand.name);
    } else {
      dayMap.set(dateKey, {
        count: 1,
        formats: new Set([ad.format]),
        brands: new Set([ad.brand.name]),
      });
    }
  }

  const days: CalendarDay[] = [];
  for (const [date, data] of dayMap) {
    days.push({
      date,
      count: data.count,
      formats: Array.from(data.formats),
      brands: Array.from(data.brands),
    });
  }

  // Stats
  const totalAds = ads.length;
  const formatCounts: Record<string, number> = {};
  const brandNames = new Set<string>();

  for (const ad of ads) {
    formatCounts[ad.format] = (formatCounts[ad.format] || 0) + 1;
    brandNames.add(ad.brand.name);
  }

  return NextResponse.json({
    year,
    month,
    days,
    stats: {
      totalAds,
      formatCounts,
      activeBrands: Array.from(brandNames),
    },
  });
}
