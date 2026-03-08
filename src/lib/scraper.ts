import { aiComplete } from "./ai";

export interface BrandProfile {
  name: string;
  description: string;
  voice: string;
  positioning: string;
  audience: string;
  usps: string[];
  colors: string[];
}

export async function scrapeBrand(url: string): Promise<BrandProfile> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; DailyAdsBot/1.0; +https://daily-ads.vercel.app)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

  const html = await res.text();
  // Trim to avoid token limits
  const trimmedHtml = html.slice(0, 30000);

  const systemPrompt = `Du bist ein Brand Analyst. Analysiere die folgende Website HTML und extrahiere Brand-Informationen.

Antworte NUR als JSON (kein Markdown, keine Erklaerung) in diesem Format:
{
  "name": "Firmenname",
  "description": "Was die Firma macht (2-3 Saetze)",
  "voice": "Beschreibung der Brand Voice (Ton, Stil, Formalitaet)",
  "positioning": "Wie sich die Firma positioniert (USP, Alleinstellung)",
  "audience": "Zielgruppe (Branche, Rolle, Groesse)",
  "usps": ["USP 1", "USP 2", "USP 3"],
  "colors": ["#hex1", "#hex2", "#hex3"]
}

Regeln:
- Alles auf Deutsch
- Extrahiere Farben aus CSS/style Attributen oder Meta-Tags
- Wenn du etwas nicht findest, mache eine fundierte Einschaetzung basierend auf dem Content
- JSON muss valide sein`;

  const result = await aiComplete(systemPrompt, `URL: ${url}\n\nHTML:\n${trimmedHtml}`);

  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as BrandProfile;
  } catch {
    throw new Error("Failed to parse brand analysis result");
  }
}
