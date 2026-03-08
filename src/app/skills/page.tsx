import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SKILLS = [
  {
    slug: "start-here",
    name: "Orchestrator",
    description:
      "Verstehe das Business und route zum richtigen Skill oder Workflow.",
  },
  {
    slug: "brand-voice",
    name: "Brand Voice",
    description:
      "Definiere die einzigartige Stimme deiner Marke fuer konsistenten Content.",
  },
  {
    slug: "positioning",
    name: "Positioning",
    description:
      "Finde den Verkaufswinkel der dich von Wettbewerbern unterscheidet.",
  },
  {
    slug: "keyword-research",
    name: "Keyword Research",
    description: "SEO-Keywords fuer den DACH-Markt finden und priorisieren.",
  },
  {
    slug: "lead-magnet",
    name: "Lead Magnet",
    description:
      "Lead-Magnete erstellen die Leute ihre Email-Adresse gerne geben.",
  },
  {
    slug: "direct-response",
    name: "Direct Response",
    description: "Verkaufstexte und Landing Pages die konvertieren.",
  },
  {
    slug: "seo-content",
    name: "SEO Content",
    description: "Artikel die bei Google.de ranken und menschlich klingen.",
  },
  {
    slug: "newsletter",
    name: "Newsletter",
    description: "Newsletter-Formate fuer regelmaessige Touchpoints.",
  },
  {
    slug: "email-sequences",
    name: "Email Sequences",
    description: "Email-Sequenzen von Anmeldung bis Kauf.",
  },
  {
    slug: "content-atomizer",
    name: "Content Atomizer",
    description: "1 Stueck Content in 15+ Pieces verwandeln.",
  },
];

export default function SkillsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Marketing Skills</h1>
        <p className="text-zinc-400 mb-8">
          10 spezialisierte KI-Skills fuer den DACH-Markt. Jeder Skill nutzt
          deine Brand Voice und Positioning als Kontext.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {SKILLS.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-emerald-400 text-sm font-mono">
                  /{skill.slug}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {skill.name}
              </h3>
              <p className="text-sm text-zinc-500">{skill.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
