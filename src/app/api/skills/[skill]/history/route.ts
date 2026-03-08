import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ skill: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skill } = await params;

  const runs = await prisma.skillRun.findMany({
    where: { userId: session.user.id, skill },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { brand: { select: { name: true } } },
  });

  return NextResponse.json(runs);
}
