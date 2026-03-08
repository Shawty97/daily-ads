import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { feedback } = await req.json();

  if (feedback !== 1 && feedback !== -1) {
    return NextResponse.json(
      { error: "feedback must be 1 or -1" },
      { status: 400 }
    );
  }

  const ad = await prisma.adCreative.findFirst({
    where: { id, brand: { userId: session.user.id } },
  });

  if (!ad) {
    return NextResponse.json({ error: "Ad not found" }, { status: 404 });
  }

  const updated = await prisma.adCreative.update({
    where: { id },
    data: { feedback },
  });

  return NextResponse.json(updated);
}
