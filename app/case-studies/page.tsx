"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { caseStudies } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function IndustryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[11px] px-2 py-0.5 border border-border-light bg-muted text-muted-foreground">
      {label}
    </span>
  );
}

function MetricPill({
  value,
  direction,
}: {
  value: string;
  direction?: "up" | "down";
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
      {direction && (
        <TrendingUp
          className={cn(
            "w-3.5 h-3.5 text-black",
            direction === "down" && "rotate-180"
          )}
        />
      )}
    </div>
  );
}

export default function CaseStudiesPage() {
  const featured = caseStudies.filter((c) => c.featured);
  const others = caseStudies.filter((c) => !c.featured);

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-black border-b border-inv-border py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-3">
            {"// CUSTOMER STORIES"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white mb-4 uppercase">
            Case Studies
          </h1>
          <p className="text-inv-muted max-w-xl leading-relaxed font-mono text-sm">
            Real-world results from engineering teams that built on Waffo. Metrics,
            architectures, and lessons learned.
          </p>
        </div>
      </div>

      {/* Featured */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
          {"// ─ FEATURED"}
        </h2>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid lg:grid-cols-2 gap-5 mb-12"
        >
          {featured.map((cs) => (
            <motion.div key={cs.slug} variants={fadeInUp}>
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group flex flex-col h-full bg-card border border-border-light overflow-hidden hover:border-black transition-all duration-100"
              >
                {/* Top band */}
                <div className="bg-black px-6 py-5 border-b border-inv-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-inv-card border border-inv-border flex items-center justify-center">
                        <span className="font-mono text-xs font-bold text-white">
                          {cs.logo}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono font-semibold text-sm text-white">{cs.company}</p>
                        <p className="font-mono text-[11px] text-inv-muted">{cs.industry}</p>
                      </div>
                    </div>
                    <IndustryBadge label={cs.tags[0]} />
                  </div>
                  {/* Metrics row */}
                  <div className="grid grid-cols-2 gap-3">
                    {cs.metrics.slice(0, 2).map((m) => (
                      <div key={m.label} className="bg-inv-card border border-inv-border px-3 py-2.5">
                        <MetricPill value={m.value} direction={m.direction} />
                        <p className="font-mono text-[10px] text-inv-muted mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="font-mono font-bold text-foreground leading-snug mb-2 group-hover:text-black transition-colors">
                    {cs.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 font-mono">
                    {cs.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-light">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {formatDate(cs.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-sm font-medium text-black group-hover:underline transition-colors">
                      Read more
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Others */}
        {others.length > 0 && (
          <>
            <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
              {"// MORE CASE STUDIES"}
            </h2>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {others.map((cs) => (
                <motion.div key={cs.slug} variants={fadeInUp}>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group flex flex-col h-full bg-card border border-border-light p-5 hover:border-black transition-all duration-100"
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 bg-muted border border-border-light flex items-center justify-center shrink-0">
                        <span className="font-mono text-[10px] font-bold text-muted-foreground">
                          {cs.logo}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono font-semibold text-sm text-foreground">{cs.company}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{cs.industry}</p>
                      </div>
                    </div>
                    <h3 className="font-mono font-semibold text-sm text-foreground leading-snug mb-2 group-hover:text-black transition-colors line-clamp-2">
                      {cs.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3 font-mono">
                      {cs.excerpt}
                    </p>
                    {/* Key metrics */}
                    <div className="mt-4 pt-4 border-t border-border-light grid grid-cols-2 gap-2">
                      {cs.metrics.slice(0, 2).map((m) => (
                        <div key={m.label}>
                          <p className="font-mono text-sm font-semibold text-foreground">{m.value}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground group-hover:text-black transition-colors">
                      Read case study
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
