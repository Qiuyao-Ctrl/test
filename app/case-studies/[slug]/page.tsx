import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return { title: cs.title, description: cs.excerpt };
}

function Metric({
  label,
  value,
  direction,
}: {
  label: string;
  value: string;
  direction?: "up" | "down";
}) {
  return (
    <div className="flex flex-col gap-1.5 p-5 bg-dark-card border border-dark-border rounded-lg">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold text-dark-text">{value}</span>
        {direction && (
          <TrendingUp
            className={cn(
              "w-5 h-5",
              direction === "up" ? "text-success" : "text-danger rotate-180"
            )}
          />
        )}
      </div>
      <span className="font-mono text-xs text-dark-muted">{label}</span>
    </div>
  );
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  const related = caseStudies
    .filter((c) => c.slug !== slug)
    .slice(0, 2);

  return (
    <div className="pt-14">
      {/* Header — dark */}
      <div className="bg-dark-bg border-b border-dark-border py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-dark-text transition-colors mb-6 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Case Studies
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-dark-card border border-dark-border rounded-xl flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-dark-text">{cs.logo}</span>
            </div>
            <div>
              <p className="font-bold text-dark-text">{cs.company}</p>
              <p className="font-mono text-xs text-dark-muted">{cs.industry}</p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-text max-w-3xl leading-snug mb-4">
            {cs.title}
          </h1>
          <p className="text-dark-muted max-w-2xl leading-relaxed mb-4">
            {cs.excerpt}
          </p>
          <span className="font-mono text-xs text-dark-muted">
            Published {formatDate(cs.publishedAt)}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-dark-bg border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cs.metrics.map((m) => (
              <Metric key={m.label} label={m.label} value={m.value} direction={m.direction} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Main */}
          <div className="max-w-2xl space-y-10">
            {/* Quote */}
            <blockquote className="border-l-4 border-primary pl-6 py-1">
              <p className="text-xl leading-relaxed text-foreground italic font-medium">
                &ldquo;{cs.quote}&rdquo;
              </p>
              <footer className="mt-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-muted border border-border rounded-full flex items-center justify-center">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {cs.quoteAuthor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-sm text-foreground">{cs.quoteAuthor}</span>
                  <span className="font-mono text-xs text-muted-foreground ml-1.5">
                    — {cs.quoteRole}
                  </span>
                </div>
              </footer>
            </blockquote>

            {/* Narrative */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">The Challenge</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {cs.company} came to Waffo facing a problem that was quietly costing them millions.{" "}
                {cs.excerpt} They needed a solution that could deliver results quickly without
                requiring a full re-architecture of their existing payment stack.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">The Solution</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                The team integrated Waffo&apos;s API using the Node.js SDK, replacing their existing
                payment provider. The integration was straightforward — the SDK&apos;s typed interface
                caught configuration errors at compile time, and the sandbox environment let them
                test edge cases before touching production.
              </p>
              <div className="bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <span className="font-mono text-xs text-white/40">Integration snippet</span>
                </div>
                <pre className="px-5 py-4 font-mono text-[12.5px] leading-6 text-slate-300 overflow-x-auto">
{`import { Waffo } from "@waffo/sdk";

const client = new Waffo({
  apiKey: process.env.WAFFO_SECRET_KEY,
  routing: { strategy: "optimize_auth_rate" },
});

const payment = await client.payments.create({
  amount: order.totalCents,
  currency: order.currency,
  customer: customer.waffoId,
  paymentMethod: paymentMethod.id,
  capture: true,
});`}
                </pre>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">The Results</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Within the first 30 days, {cs.company} saw measurable improvements across every
                key metric. The smart routing engine immediately began optimizing for their
                specific card mix and customer geography. Within 60 days, they had achieved the
                results highlighted above, with continued improvement as the ML model accumulated
                more data.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border">
              {cs.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-5">
              <div className="bg-card border border-border rounded-lg p-5">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
                  Key Results
                </p>
                <div className="space-y-3">
                  {cs.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                      <span className="text-xs text-muted-foreground">{m.label}</span>
                      <span className="font-mono text-sm font-semibold text-foreground">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/8 border border-primary/20 rounded-lg p-5">
                <p className="font-semibold text-sm text-foreground mb-2">Build on Waffo</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Start with the quickstart guide and be in production in under an hour.
                </p>
                <Link
                  href="/guides/getting-started-payment-api"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Read quickstart →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">More Case Studies</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/case-studies/${r.slug}`}
                  className="group flex flex-col bg-card border border-border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-muted border border-border rounded flex items-center justify-center shrink-0">
                      <span className="font-mono text-[9px] font-bold text-muted-foreground">
                        {r.logo}
                      </span>
                    </div>
                    <span className="font-semibold text-xs text-muted-foreground">{r.company}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
