import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { scrapeBrand } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const profile = await scrapeBrand(url);

    const brand = await prisma.brand.create({
      data: {
        userId: session.user.id,
        name: profile.name,
        url,
        description: profile.description,
        colors: profile.colors,
        voice: profile.voice,
        positioning: profile.positioning,
        audience: profile.audience,
        usps: profile.usps,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze brand";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { adCreatives: true, skillRuns: true } } },
  });

  return NextResponse.json(brands);
}
