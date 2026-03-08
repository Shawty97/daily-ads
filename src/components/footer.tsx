export function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} A-Impact. Alle Rechte vorbehalten.
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a
              href="https://ideabrowser-three.vercel.app"
              target="_blank"
              rel="noopener"
              className="hover:text-white transition-colors"
            >
              IdeaBrowser
            </a>
            <a
              href="https://business-os-v2-mu.vercel.app"
              target="_blank"
              rel="noopener"
              className="hover:text-white transition-colors"
            >
              Business OS
            </a>
            <a
              href="https://colony.a-impact.io"
              target="_blank"
              rel="noopener"
              className="hover:text-white transition-colors"
            >
              Colony
            </a>
            <a
              href="https://a-impact.io"
              target="_blank"
              rel="noopener"
              className="hover:text-white transition-colors"
            >
              A-Impact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
