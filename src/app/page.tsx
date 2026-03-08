import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const EXAMPLE_ADS = [
  {
    format: "napkin-math",
    hook: "Marketing-Team: 15.000 EUR/Monat. Daily Ads: 0 EUR.",
    body: "1 Marketing-Manager: 5.000 EUR\n1 Texter: 4.000 EUR\n1 Designer: 4.000 EUR\nTools & Ads Budget: 2.000 EUR\n= 15.000 EUR/Monat\n\nOder: 1 KI-Tool das alles macht.\nDein ROI ab Tag 1.",
  },
  {
    format: "fake-text",
    hook: "CEO an Marketing-Leiter, 07:43",
    body: '"Warum haben wir immer noch keine Social Posts diese Woche?"\n"Wir brauchen mehr Content"\n"Was machen eigentlich die anderen 3 im Team?"\n\nPlot twist: Die KI hat schon 15 Posts erstellt. Um 06:00.',
  },
  {
    format: "tweet-screenshot",
    hook: "Unpopular opinion:",
    body: "90% aller DACH-Unternehmen brauchen kein Marketing-Team.\n\nSie brauchen ein System das Content produziert waehrend sie schlafen.\n\nWir haben 10 KI-Skills gebaut die genau das tun.\n\n47 Retweets, 312 Likes",
  },
];

const SKILLS_PREVIEW = [
  { name: "Brand Voice", desc: "Definiere deine einzigartige Markenstimme" },
  { name: "Positioning", desc: "Finde den Winkel der dich verkauft" },
  { name: "SEO Content", desc: "Artikel die ranken und konvertieren" },
  { name: "Direct Response", desc: "Verkaufstexte auf Weltklasse-Niveau" },
  { name: "Content Atomizer", desc: "1 Content-Stueck = 15 Pieces" },
  { name: "Email Sequences", desc: "Von Anmeldung bis Kauf automatisiert" },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            KI-generierte Ad Creatives
            <br />
            <span className="text-emerald-400">fuer den DACH-Markt</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            Gib deine Website-URL ein. Unsere KI analysiert deine Marke und
            generiert hochkonvertierende Werbetexte in 8 Formaten — angepasst
            an den deutschen Markt.
          </p>
          <Link
            href="/brands/new"
            className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-400 transition-colors"
          >
            Marke analysieren
          </Link>
        </section>

        {/* Example Ads */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Beispiel Ad Creatives
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLE_ADS.map((ad, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="text-xs text-emerald-400 uppercase tracking-wider mb-3">
                  {ad.format}
                </div>
                <h3 className="font-bold text-white mb-3">{ad.hook}</h3>
                <p className="text-zinc-400 text-sm whitespace-pre-line">
                  {ad.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-2 text-center">
            10 Marketing-Skills
          </h2>
          <p className="text-zinc-400 text-center mb-8">
            Jeder Skill nutzt deine Brand Voice als Kontext
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {SKILLS_PREVIEW.map((skill) => (
              <div
                key={skill.name}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4"
              >
                <h3 className="font-semibold text-white mb-1">{skill.name}</h3>
                <p className="text-sm text-zinc-500">{skill.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/skills"
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              Alle 10 Skills ansehen &rarr;
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Website analysieren</h3>
              <p className="text-zinc-400">
                Gib eine URL ein und unsere KI extrahiert automatisch Brand
                Voice, Positioning, Zielgruppe und USPs. Kein manuelles Setup
                noetig.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">8 Ad-Formate</h3>
              <p className="text-zinc-400">
                Meme, Fake-Text, Stat-Card, UGC, Napkin-Math, Tweet, Slack und
                LinkedIn — jedes Format optimiert fuer maximale Conversion.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">DACH-optimiert</h3>
              <p className="text-zinc-400">
                Keine US-Copy die uebersetzt wurde. Alle Prompts sind fuer den
                deutschen Markt geschrieben — DSGVO-konform, passender Ton,
                richtige Anrede.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Feedback-Loop</h3>
              <p className="text-zinc-400">
                Bewerte jede Ad mit Daumen hoch/runter. Die KI lernt welcher
                Stil fuer deine Marke am besten funktioniert.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
