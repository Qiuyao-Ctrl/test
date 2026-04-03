"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  GitFork,
  HelpCircle,
  ListChecks,
  AtSign,
  Mail,
  ArrowRight,
  ExternalLink,
  Users,
  BookOpen,
  Code2,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Github: GitFork,
  HelpCircle,
  ListChecks,
  Twitter: AtSign,
  Mail,
};

const RESOURCES = [
  {
    id: "discord",
    icon: "MessageSquare",
    title: "Developer Discord",
    description:
      "The most active place for Waffo developers. Get help, share integrations, follow release announcements, and chat directly with the Waffo engineering team.",
    meta: "12,400+ developers",
    metaIcon: Users,
    category: "Community",
    href: "#",
    external: true,
    highlight: true,
  },
  {
    id: "github",
    icon: "Github",
    title: "GitHub",
    description:
      "Open-source SDKs, sample integrations, and CLI tools. The Node.js, Python, and Go SDKs are open source. Bug reports and PRs welcome.",
    meta: "847 stars",
    metaIcon: Star,
    category: "Open Source",
    href: "#",
    external: true,
    highlight: false,
  },
  {
    id: "stackoverflow",
    icon: "HelpCircle",
    title: "Stack Overflow",
    description:
      "Search or ask questions tagged [waffo-api]. The Waffo team actively monitors and answers questions here.",
    meta: "500+ answered",
    metaIcon: HelpCircle,
    category: "Q&A",
    href: "#",
    external: true,
    highlight: false,
  },
  {
    id: "newsletter",
    icon: "Mail",
    title: "Developer Newsletter",
    description:
      "Monthly digest of new features, guides, case studies, and community highlights. 8,200 subscribers and growing.",
    meta: "8,200 subscribers",
    metaIcon: Mail,
    category: "Newsletter",
    href: "#",
    external: false,
    highlight: false,
  },
  {
    id: "twitter",
    icon: "Twitter",
    title: "X / Twitter",
    description:
      "Follow @waffo_dev for API status updates, new features, and quick developer tips.",
    meta: "@waffo_dev",
    metaIcon: AtSign,
    category: "Social",
    href: "#",
    external: true,
    highlight: false,
  },
  {
    id: "updates",
    icon: "ListChecks",
    title: "Changelog",
    description:
      "Detailed release notes for every update. Subscribe for weekly digest emails sent every Tuesday.",
    meta: "Weekly releases",
    metaIcon: ListChecks,
    category: "Updates",
    href: "/updates",
    external: false,
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Is there a free tier?",
    a: "Yes. Waffo offers a Sandbox environment that is always free. For production usage, pricing is based on transaction volume with no monthly minimums.",
  },
  {
    q: "How do I get API keys?",
    a: "Sign up for a Waffo account and navigate to Settings → API Keys. Sandbox keys are available immediately. Production keys require account verification.",
  },
  {
    q: "Which programming languages are supported?",
    a: "Official SDKs are available for Node.js, Python, Go, Ruby, PHP, and Java. The REST API can be used directly from any language.",
  },
  {
    q: "What is the SLA for the API?",
    a: "Waffo guarantees 99.99% monthly uptime for the core Payments API, equivalent to less than 52 minutes of downtime per year. Status is available at status.waffo.dev.",
  },
  {
    q: "Can I use Waffo for marketplace payments?",
    a: "Yes. Waffo supports marketplace and platform use cases through Connect-style accounts. Contact the sales team for custom pricing on high-volume platforms.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-light last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-mono font-semibold text-sm text-foreground">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed font-mono">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubscribed(true);
  }

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-black border-b border-inv-border py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-3">
            {"// COMMUNITY"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white mb-4 uppercase">
            Join 12,000+ developers
          </h1>
          <p className="text-inv-muted max-w-xl leading-relaxed font-mono text-sm">
            Get help, share what you&apos;re building, and stay ahead of the API curve.
            The Waffo developer community is active across multiple channels.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-8">
            {[
              { icon: Users, label: "Discord Members", value: "12,400+" },
              { icon: Star, label: "GitHub Stars", value: "847" },
              { icon: HelpCircle, label: "SO Answers", value: "500+" },
              { icon: Mail, label: "Newsletter Subscribers", value: "8,200" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-inv-muted" />
                <span className="font-mono text-sm font-semibold text-white">
                  {s.value}
                </span>
                <span className="font-mono text-xs text-inv-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
        >
          {RESOURCES.map((r) => {
            const Icon = ICON_MAP[r.icon] ?? MessageSquare;
            const MetaIcon = r.metaIcon;
            return (
              <motion.div key={r.id} variants={fadeInUp}>
                <a
                  href={r.href === "#" ? undefined : r.href}
                  {...(r.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={cn(
                    "group flex flex-col h-full bg-card border p-5 transition-all duration-100",
                    r.highlight
                      ? "border-black hover:border-black"
                      : "border-border-light hover:border-black"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-muted border border-black flex items-center justify-center">
                      <Icon className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted border border-border-light px-2 py-0.5">
                      {r.category}
                    </span>
                  </div>
                  <h3 className="font-mono font-semibold text-sm text-foreground mb-1.5 group-hover:text-black transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 font-mono">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <MetaIcon className="w-3 h-3" />
                      {r.meta}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-mono font-medium text-black group-hover:underline transition-colors">
                      {r.external ? (
                        <>
                          Open
                          <ExternalLink className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          View
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </span>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Newsletter signup */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-black border border-inv-border p-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-inv-muted" />
              <span className="font-mono font-semibold text-white">Developer Newsletter</span>
            </div>
            <p className="text-inv-muted text-sm leading-relaxed mb-5 font-mono">
              Monthly digest of new features, guides, community highlights, and API tips.
              Join 8,200 developers who read it every month.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-white font-mono text-sm">
                <span className="w-2 h-2 bg-white" />
                [OK] You&apos;re subscribed. See you in your inbox!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-3 py-2 bg-inv-card border border-inv-border text-sm text-white placeholder:text-inv-muted focus:outline focus:outline-1 focus:outline-white transition-colors font-mono"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-inv-muted text-black text-sm font-mono font-medium px-4 py-2 transition-colors duration-75 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-muted border border-border-light p-8">
            <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-black" />
              Getting Started
            </h3>
            <div className="space-y-2">
              {[
                { label: "Quickstart guide", href: "/guides/getting-started-payment-api" },
                { label: "Webhook setup", href: "/guides/webhook-best-practices" },
                { label: "Sandbox testing", href: "/guides/sandbox-testing" },
                { label: "API Reference", href: "#", external: true },
              ].map((link) => (
                <div key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-black transition-colors duration-75 py-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                      {link.label}
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-black transition-colors duration-75 py-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-5 h-5 text-black" />
            <h2 className="text-xl font-mono font-bold text-foreground uppercase">Frequently Asked Questions</h2>
          </div>
          <div className="bg-card border border-black px-6 divide-y divide-border-light">
            {FAQ.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
