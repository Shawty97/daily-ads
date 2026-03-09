import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brandId = req.nextUrl.searchParams.get("brandId");
  const format = req.nextUrl.searchParams.get("format");
  const unrated = req.nextUrl.searchParams.get("unrated");

  const date = req.nextUrl.searchParams.get("date");

  const where: Record<string, unknown> = {
    brand: { userId: session.user.id },
  };
  if (brandId) where.brandId = brandId;
  if (format) where.format = format;
  if (unrated === "true") where.feedback = null;
  if (date) {
    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.999Z");
    if (!isNaN(start.getTime())) {
      where.createdAt = { gte: start, lte: end };
    }
  }

  const ads = await prisma.adCreative.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { brand: { select: { name: true, url: true } } },
  });

  return NextResponse.json(ads);
}
