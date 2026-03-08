import { Resend } from "resend";

interface DigestAd {
  hook: string;
  body: string;
  format: string;
}

interface DigestBrand {
  name: string;
  ads: DigestAd[];
}

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://daily-ads.a-impact.io";
const APP_URL = rawAppUrl.replace(/[<>"']/g, "");
const FROM_EMAIL = process.env.EMAIL_FROM || "Daily Ads <noreply@a-impact.io>";

export async function sendDigestEmail(
  to: string,
  userName: string,
  brands: DigestBrand[]
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[digest] RESEND_API_KEY not set, skipping email to", to);
    return;
  }

  const resend = new Resend(apiKey);

  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const brandSections = brands
    .map(
      (brand) => `
      <div style="margin-bottom: 32px;">
        <h2 style="color: #10b981; font-size: 18px; margin-bottom: 12px; border-bottom: 1px solid #3f3f46; padding-bottom: 8px;">
          ${escapeHtml(brand.name)}
        </h2>
        ${brand.ads
          .map(
            (ad) => `
          <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <span style="color: #10b981; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
              ${escapeHtml(ad.format)}
            </span>
            <h3 style="color: #ffffff; font-size: 15px; margin: 8px 0 4px 0;">
              ${escapeHtml(ad.hook)}
            </h3>
            <p style="color: #a1a1aa; font-size: 13px; white-space: pre-line; margin: 0;">
              ${escapeHtml(ad.body)}
            </p>
          </div>
        `
          )
          .join("")}
      </div>
    `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="background: #09090b; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 4px;">
      Deine Daily Ads
    </h1>
    <p style="color: #71717a; font-size: 14px; margin-bottom: 32px;">
      Hallo ${escapeHtml(userName || "dort")}, hier sind deine neuen Ads vom ${today}
    </p>

    ${brandSections}

    <div style="text-align: center; margin-top: 32px;">
      <a href="${APP_URL}/ads" style="display: inline-block; background: #10b981; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Alle Ads ansehen
      </a>
    </div>

    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272a; text-align: center;">
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        Daily Ads by A-Impact
      </p>
      <p style="color: #3f3f46; font-size: 11px; margin-top: 4px;">
        <a href="${APP_URL}/settings" style="color: #3f3f46; text-decoration: underline;">Email-Einstellungen</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Deine Daily Ads — ${today}`,
    html,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
