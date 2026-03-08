import { aiComplete } from "./ai";

export interface AdCreativeInput {
  format: string;
  hook: string;
  body: string;
  cta: string | null;
}

interface BrandInfo {
  name: string;
  url: string;
  description?: string | null;
  voice?: string | null;
  positioning?: string | null;
  audience?: string | null;
  usps: string[];
}

const AD_FORMATS = [
  "meme",
  "fake-text",
  "stat-card",
  "ugc",
  "napkin-math",
  "tweet-screenshot",
  "slack-screenshot",
  "linkedin",
] as const;

export type AdFormat = (typeof AD_FORMATS)[number];

export function getAdFormats(): readonly string[] {
  return AD_FORMATS;
}

export async function generateAds(
  brand: BrandInfo,
  count: number,
  formats?: string[]
): Promise<AdCreativeInput[]> {
  const selectedFormats = formats?.length
    ? formats
    : AD_FORMATS.slice(0, count);

  const systemPrompt = `Du bist ein Werbetexter fuer den DACH-Markt. Du generierst Ad Creatives in verschiedenen Formaten.

Brand Kontext:
- Name: ${brand.name}
- URL: ${brand.url}
${brand.description ? `- Beschreibung: ${brand.description}` : ""}
${brand.voice ? `- Brand Voice: ${brand.voice}` : ""}
${brand.positioning ? `- Positioning: ${brand.positioning}` : ""}
${brand.audience ? `- Zielgruppe: ${brand.audience}` : ""}
${brand.usps.length > 0 ? `- USPs: ${brand.usps.join(", ")}` : ""}

Antworte NUR als JSON Array (kein Markdown, keine Erklaerung):
[
  {
    "format": "format-name",
    "hook": "Der Hook / die Headline",
    "body": "Der Body-Text der Ad",
    "cta": "Call to Action Text oder null"
  }
]

Format-Beschreibungen:
- meme: Witziger, meme-artiger Text. Relatable, leicht provokant.
- fake-text: Fake iMessage/WhatsApp Konversation die das Produkt zeigt.
- stat-card: Statistik/Zahl-basierte Ad mit einer ueberzeugenden Metrik.
- ugc: User-Generated-Content Stil. Authentisch, wie eine echte Bewertung.
- napkin-math: Einfache Rechnung die den ROI/Wert zeigt. "Vorher X EUR, nachher Y EUR".
- tweet-screenshot: Im Stil eines viralen Tweets.
- slack-screenshot: Im Stil einer Slack-Nachricht (z.B. CEO schreibt ins Team).
- linkedin: LinkedIn Post Format mit Hook, Story, Takeaway.

DACH-Regeln:
- Nicht zu aggressiv, Deutsche sind skeptisch bei Uebertreibungen
- Beweise > Versprechen
- DSGVO wenn relevant erwaehnen
- EUR statt USD
- Professionell aber nicht langweilig`;

  const userMessage = `Generiere ${count} Ad Creatives in diesen Formaten: ${selectedFormats.join(", ")}

Jede Ad soll einzigartig sein mit unterschiedlichen Hooks und Ansaetzen.`;

  const result = await aiComplete(systemPrompt, userMessage);

  try {
    const cleaned = result
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as AdCreativeInput[];
  } catch {
    throw new Error("Failed to parse ad generation result");
  }
}
