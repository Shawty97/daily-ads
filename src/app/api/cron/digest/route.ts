import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";
import { sendDigestEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || !secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const provided = Buffer.from(secret);
  const expected = Buffer.from(cronSecret);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find users with digest enabled (or no preference record = default enabled)
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { emailPreference: { digestEnabled: true } },
        { emailPreference: null },
      ],
    },
    include: {
      emailPreference: true,
      brands: {
        include: {
          adCreatives: {
            where: { createdAt: { gte: since } },
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      },
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const user of users) {
    const brandsWithAds = user.brands
      .filter((b) => b.adCreatives.length > 0)
      .map((b) => ({
        name: b.name,
        ads: b.adCreatives.map((ad) => ({
          hook: ad.hook,
          body: ad.body,
          format: ad.format,
        })),
      }));

    if (brandsWithAds.length === 0) {
      skipped++;
      continue;
    }

    try {
      await sendDigestEmail(user.email, user.name || "", brandsWithAds);
      sent++;
    } catch (err) {
      console.error(`[digest] Failed to send to ${user.email}:`, err);
      skipped++;
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    skipped,
    totalUsers: users.length,
  });
}
