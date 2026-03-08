const ECOSYSTEM_LINKS = [
  {
    href: "https://ideabrowser-three.vercel.app",
    title: "IdeaBrowser",
    desc: "Discover and generate AI-powered business ideas with market analysis.",
    action: "Find Ideas →",
    hoverBorder: "hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-500/5",
    hoverText: "group-hover:text-cyan-400",
  },
  {
    href: "https://business-os-v2-mu.vercel.app",
    title: "Business OS",
    desc: "Generate a complete business blueprint in 90 seconds.",
    action: "Build Business →",
    hoverBorder: "hover:border-indigo-500/50",
    hoverBg: "hover:bg-indigo-500/5",
    hoverText: "group-hover:text-indigo-400",
  },
  {
    href: "https://colony.a-impact.io",
    title: "Colony",
    desc: "AI-powered lead qualification, outreach, and pipeline automation.",
    action: "Get Leads →",
    hoverBorder: "hover:border-green-500/50",
    hoverBg: "hover:bg-green-500/5",
    hoverText: "group-hover:text-green-400",
  },
  {
    href: "https://a-impact.io",
    title: "A-Impact",
    desc: "AI Departments as a Service — Sales, Marketing, Support and more.",
    action: "Full Marketing →",
    hoverBorder: "hover:border-purple-500/50",
    hoverBg: "hover:bg-purple-500/5",
    hoverText: "group-hover:text-purple-400",
  },
];

const FOOTER_NAV = [
  { href: "https://a-impact.io", label: "A-Impact" },
  { href: "https://ideabrowser-three.vercel.app", label: "IdeaBrowser" },
  { href: "https://business-os-v2-mu.vercel.app", label: "Business OS" },
  { href: "https://colony.a-impact.io", label: "Colony" },
  { href: "https://robert-kopi.com", label: "Robert Kopi" },
];

export function EcosystemFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-800 pt-10 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            A-Impact Ecosystem
          </h3>
          <p className="text-sm text-zinc-600">
            From idea to revenue — powered by AI
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all ${link.hoverBorder} ${link.hoverBg}`}
            >
              <div className={`mb-2 text-lg font-bold text-white transition-colors ${link.hoverText}`}>
                {link.title}
              </div>
              <p className="mb-3 text-sm text-zinc-500">{link.desc}</p>
              <span className={`text-xs font-medium text-zinc-600 transition-colors ${link.hoverText}`}>
                {link.action}
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
          {FOOTER_NAV.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 && <span className="text-zinc-700">|</span>}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={i === 0 ? "text-amber-500 hover:underline" : "text-zinc-500 hover:text-zinc-300"}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <div className="text-center text-sm text-zinc-600">
          Daily Ads by{" "}
          <a href="https://a-impact.io" className="text-amber-500 hover:underline">
            A-Impact
          </a>{" "}
          — AI Departments as a Service
        </div>
      </div>
    </footer>
  );
}
