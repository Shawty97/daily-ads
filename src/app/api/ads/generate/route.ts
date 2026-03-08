import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAds } from "@/lib/ad-gen";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const brandId = body.brandId;
  const count = Math.min(Math.max(Number(body.count) || 4, 1), 8);
  const formats = Array.isArray(body.formats) ? body.formats.slice(0, 8) : undefined;

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
        imageUrl: ad.imageUrl ?? null,
        hookVariants: ad.hookVariants
          ? (ad.hookVariants as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      })),
    });

    return NextResponse.json(created);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate ads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
