import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runSkill, type BrandContext } from "@/lib/skill-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ skill: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skill } = await params;
  const { brandId, input } = await req.json();

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "input required" }, { status: 400 });
  }

  let brandContext: BrandContext | null = null;

  if (brandId) {
    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
    });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }
    brandContext = {
      name: brand.name,
      url: brand.url,
      description: brand.description,
      voice: brand.voice,
      positioning: brand.positioning,
      audience: brand.audience,
      usps: brand.usps,
    };
  }

  try {
    const output = await runSkill(skill, brandContext, input);

    const run = await prisma.skillRun.create({
      data: {
        userId: session.user.id,
        brandId: brandId || null,
        skill,
        input,
        output,
      },
    });

    return NextResponse.json(run);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Skill execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
