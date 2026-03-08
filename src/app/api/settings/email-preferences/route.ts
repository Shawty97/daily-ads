import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pref = await prisma.emailPreference.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(
    pref ?? { digestEnabled: true, digestTime: "08:00" }
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    digestEnabled?: boolean;
    digestTime?: string;
  };

  const digestEnabled =
    typeof body.digestEnabled === "boolean" ? body.digestEnabled : true;
  const digestTime =
    typeof body.digestTime === "string" ? body.digestTime : "08:00";

  // Validate time format HH:MM
  if (!/^\d{2}:\d{2}$/.test(digestTime)) {
    return NextResponse.json(
      { error: "Ungueltige Zeitangabe (HH:MM)" },
      { status: 400 }
    );
  }

  const pref = await prisma.emailPreference.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      digestEnabled,
      digestTime,
    },
    update: {
      digestEnabled,
      digestTime,
    },
  });

  return NextResponse.json(pref);
}
