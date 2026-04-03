import Link from "next/link";
import { ExternalLink } from "lucide-react";

const FOOTER_LINKS = {
  Developers: [
    { label: "Guides", href: "/guides" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Demos", href: "/demos" },
    { label: "Updates", href: "/updates" },
    { label: "Community", href: "/community" },
  ],
  Documentation: [
    { label: "API Reference", href: "#", external: true },
    { label: "SDK Reference", href: "#", external: true },
    { label: "Webhooks", href: "#", external: true },
    { label: "Sandbox", href: "#", external: true },
    { label: "Status Page", href: "#", external: true },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Security", href: "#" },
    { label: "PCI Compliance", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-inv-border">
      {/* ASCII separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <p className="font-mono text-xs text-inv-muted select-none overflow-hidden whitespace-nowrap">
          {"// ─────────────────────────────────── WAFFO.DEV ───────────────────────────────────"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-0 mb-4 font-mono text-sm font-semibold text-white">
              <span className="text-inv-muted mr-1">{">"}</span>
              waffo
              <span className="text-inv-muted">.dev</span>
            </Link>
            <p className="text-inv-muted text-xs leading-relaxed max-w-xs font-mono">
              Payments infrastructure for developers who ship fast. Build, test, and scale your payment flows.
            </p>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-white border border-inv-border px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-white animate-pulse" />
                {"[OK]"} ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-[10px] font-mono font-medium text-inv-muted uppercase tracking-widest mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-mono text-inv-muted hover:text-white transition-colors duration-75"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs font-mono text-inv-muted hover:text-white transition-colors duration-75"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-inv-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-inv-muted">
            {"©"} 2026 Waffo, Inc.
          </p>
          <div className="flex items-center gap-0 font-mono text-[11px] text-inv-muted">
            <a href="#" className="hover:text-white transition-colors duration-75 px-2">X / Twitter</a>
            <span>/</span>
            <a href="#" className="hover:text-white transition-colors duration-75 px-2">GitHub</a>
            <span>/</span>
            <a href="#" className="hover:text-white transition-colors duration-75 px-2">Discord</a>
            <span>/</span>
            <a href="#" className="hover:text-white transition-colors duration-75 px-2">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
