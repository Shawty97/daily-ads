import fs from "fs";
import path from "path";

export interface SkillDefinition {
  slug: string;
  name: string;
  description: string;
  prompt: string;
}

const SKILL_DIR = path.join(process.cwd(), "src/lib/skill-prompts");

function loadSkill(
  filename: string,
  slug: string,
  name: string,
  description: string
): SkillDefinition {
  const content = fs.readFileSync(path.join(SKILL_DIR, filename), "utf-8");
  return { slug, name, description, prompt: content };
}

export const SKILLS: SkillDefinition[] = [
  loadSkill(
    "01-start-here.md",
    "start-here",
    "Orchestrator",
    "Verstehe das Business und route zum richtigen Skill oder Workflow."
  ),
  loadSkill(
    "02-brand-voice.md",
    "brand-voice",
    "Brand Voice",
    "Definiere die einzigartige Stimme deiner Marke fuer konsistenten Content."
  ),
  loadSkill(
    "03-positioning.md",
    "positioning",
    "Positioning",
    "Finde den Verkaufswinkel der dich von Wettbewerbern unterscheidet."
  ),
  loadSkill(
    "04-keyword-research.md",
    "keyword-research",
    "Keyword Research",
    "SEO-Keywords fuer den DACH-Markt finden und priorisieren."
  ),
  loadSkill(
    "05-lead-magnet.md",
    "lead-magnet",
    "Lead Magnet",
    "Lead-Magnete erstellen die Leute ihre Email-Adresse gerne geben."
  ),
  loadSkill(
    "06-direct-response.md",
    "direct-response",
    "Direct Response",
    "Verkaufstexte und Landing Pages die konvertieren."
  ),
  loadSkill(
    "07-seo-content.md",
    "seo-content",
    "SEO Content",
    "Artikel die bei Google.de ranken und menschlich klingen."
  ),
  loadSkill(
    "08-newsletter.md",
    "newsletter",
    "Newsletter",
    "Newsletter-Formate fuer regelmaessige Touchpoints."
  ),
  loadSkill(
    "09-email-sequences.md",
    "email-sequences",
    "Email Sequences",
    "Email-Sequenzen von Anmeldung bis Kauf."
  ),
  loadSkill(
    "10-content-atomizer.md",
    "content-atomizer",
    "Content Atomizer",
    "1 Stueck Content in 15+ Pieces verwandeln."
  ),
];

export function getSkill(slug: string): SkillDefinition | undefined {
  return SKILLS.find((s) => s.slug === slug);
}
