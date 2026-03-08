import { getSkill } from "./skills";
import { aiComplete } from "./ai";

export interface BrandContext {
  name: string;
  url: string;
  description?: string | null;
  voice?: string | null;
  positioning?: string | null;
  audience?: string | null;
  usps: string[];
}

function buildBrandContextPrompt(brand: BrandContext): string {
  const parts = [
    `## Brand Kontext`,
    `**Name:** ${brand.name}`,
    `**URL:** ${brand.url}`,
  ];
  if (brand.description) parts.push(`**Beschreibung:** ${brand.description}`);
  if (brand.voice) parts.push(`**Brand Voice:**\n${brand.voice}`);
  if (brand.positioning) parts.push(`**Positioning:**\n${brand.positioning}`);
  if (brand.audience) parts.push(`**Zielgruppe:**\n${brand.audience}`);
  if (brand.usps.length > 0)
    parts.push(`**USPs:** ${brand.usps.join(", ")}`);
  return parts.join("\n\n");
}

export async function runSkill(
  skillSlug: string,
  brandContext: BrandContext | null,
  userInput: string
): Promise<string> {
  const skill = getSkill(skillSlug);
  if (!skill) throw new Error(`Skill "${skillSlug}" not found`);

  let systemPrompt = skill.prompt;
  if (brandContext) {
    systemPrompt += "\n\n---\n\n" + buildBrandContextPrompt(brandContext);
  }

  return aiComplete(systemPrompt, userInput);
}
