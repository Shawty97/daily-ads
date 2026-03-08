import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAds } from "@/lib/ad-gen";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandId, count = 4, formats } = await req.json();
  if (!brandId) {
    return NextResponse.json({ error: "brandId required" }, { status: 400 });
  }

  const brand = await prisma.brand.findFirst({
    where: { id: brandId, userId: session.user.id },
  });

  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  try {
    const ads = await generateAds(brand, count, formats);

    const created = await prisma.adCreative.createManyAndReturn({
      data: ads.map((ad) => ({
        brandId: brand.id,
        format: ad.format,
        hook: ad.hook,
        body: ad.body,
        cta: ad.cta,
        angle: "angle" in ad ? (ad as Record<string, unknown>).angle as string : null,
      })),
    });

    return NextResponse.json(created);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate ads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
