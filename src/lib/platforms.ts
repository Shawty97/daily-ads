export interface PlatformPreset {
  id: string;
  name: string;
  icon: string;
  charLimit: number | null;
  hashtagLimit: number | null;
  tone: string;
  description: string;
  promptContext: string;
}

export const PLATFORMS: PlatformPreset[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "IG",
    charLimit: 2200,
    hashtagLimit: 30,
    tone: "visual-first, lifestyle",
    description: "Max. 2200 Zeichen, bis 30 Hashtags, visuell orientiert",
    promptContext: `Plattform: Instagram
- Maximale Caption-Laenge: 2200 Zeichen
- Bis zu 30 Hashtags erlaubt (nutze 5-15 relevante)
- Visuell orientiert: Der Text muss das Bild ergaenzen
- Emojis sparsam aber gezielt einsetzen
- Hook in den ersten 125 Zeichen (vor "mehr anzeigen")
- Call-to-Action: "Link in Bio", "Speichern", "Teilen"
- Story-telling und Authentizitaet performen gut
- Carousel-freundliche Struktur wenn moeglich`,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "TT",
    charLimit: 150,
    hashtagLimit: 5,
    tone: "schnell, trend-orientiert, unterhaltsam",
    description: "Max. 150 Zeichen Caption, Trend-Hooks, schnelles Tempo",
    promptContext: `Plattform: TikTok
- Maximale Caption-Laenge: 150 Zeichen (sehr kurz!)
- Nur 3-5 Hashtags (trending + nische)
- Hook in den ersten 3 Sekunden / ersten Worten
- Trend-Formate nutzen: "POV:", "Storytime:", "Things that just make sense:"
- Unterhaltsam und schnell, keine langen Erklaerungen
- Gen-Z/Millennial Sprache erlaubt
- Kontroverse/Provokation performt (aber brand-safe bleiben)
- CTA: "Folgen fuer mehr", "Link in Bio"`,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "LI",
    charLimit: 3000,
    hashtagLimit: 5,
    tone: "professionell, Thought Leadership",
    description: "Professioneller Ton, laengere Form, Thought Leadership",
    promptContext: `Plattform: LinkedIn
- Maximale Laenge: 3000 Zeichen (nutze 1000-2000 fuer optimale Performance)
- Maximal 3-5 Hashtags am Ende
- Professioneller aber persoenlicher Ton
- Thought Leadership: Erkenntnisse, Daten, Erfahrungen teilen
- Absaetze kurz halten (1-2 Saetze), Leerzeilen dazwischen
- Hook-Zeile entscheidend (vor "...mehr anzeigen")
- Storytelling: Problem > Erkenntnis > Loesung > Takeaway
- Keine Emojis-Ueberladung, maximal 2-3 dezent
- B2B-Fokus: ROI, Effizienz, Skalierung ansprechen`,
  },
  {
    id: "x",
    name: "X / Twitter",
    icon: "X",
    charLimit: 280,
    hashtagLimit: 2,
    tone: "punchy, direkt, thread-freundlich",
    description: "Max. 280 Zeichen, Thread-freundlich, knackig",
    promptContext: `Plattform: X (Twitter)
- Maximale Laenge: 280 Zeichen pro Tweet
- Maximal 1-2 Hashtags (oder keine)
- Kurz, punchy, auf den Punkt
- Thread-Format: Haupttweet + 3-5 Folge-Tweets moeglich
- Kontroverse Meinungen und Hot Takes performen
- Zahlen und Statistiken funktionieren gut
- Kein "corporate speak" — direkt und menschlich
- CTA subtil: Frage stellen, Retweet-wuerdig machen
- Formatierung: Zeilenumbrueche fuer Lesbarkeit`,
  },
];

export function getPlatformById(id: string): PlatformPreset | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

export function getPlatformPromptContext(platformIds: string[]): string {
  if (platformIds.length === 0) return "";

  const platforms = platformIds
    .map(getPlatformById)
    .filter((p): p is PlatformPreset => p !== undefined);

  if (platforms.length === 0) return "";

  if (platforms.length === 1) {
    return `\n\nPLATTFORM-VORGABEN:\n${platforms[0].promptContext}`;
  }

  const sections = platforms
    .map((p) => p.promptContext)
    .join("\n\n---\n\n");

  return `\n\nMULTI-PLATTFORM VORGABEN (generiere fuer JEDE Plattform angepasste Versionen):\n${sections}`;
}
