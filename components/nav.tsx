"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/guides", label: "Guides" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/demos", label: "Demos" },
  { href: "/updates", label: "Updates" },
  { href: "/community", label: "Community" },
  { href: "#", label: "View Docs", external: true },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-150",
        scrolled
          ? "bg-white border-b border-black"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-sm font-semibold text-black flex items-center gap-0"
          >
            <span className="text-muted-foreground mr-1">{">"}</span>
            waffo
            <span className="text-muted-foreground">.dev</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map((link) => {
              const isActive =
                !link.external &&
                (pathname === link.href || pathname.startsWith(link.href + "/"));
              const sharedClass = cn(
                "font-mono text-xs tracking-wider uppercase px-3 py-2 transition-colors duration-75",
                isActive
                  ? "bg-black text-white"
                  : "text-black hover:bg-black hover:text-white"
              );
              const inner = (
                <>
                  {link.label}
                  {link.external && (
                    <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-70" />
                  )}
                </>
              );
              return link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={sharedClass}
                >
                  {inner}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={sharedClass}>
                  {inner}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-black hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black bg-white">
          <div className="px-4 py-3 flex flex-col gap-0">
            {NAV_LINKS.map((link) => {
              const isActive =
                !link.external &&
                (pathname === link.href || pathname.startsWith(link.href + "/"));
              const sharedClass = cn(
                "flex items-center gap-1.5 px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors duration-75",
                isActive
                  ? "bg-black text-white"
                  : "text-black hover:bg-black hover:text-white"
              );
              return link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={sharedClass}
                >
                  {link.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={sharedClass}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
