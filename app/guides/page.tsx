"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { guides } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(guides.map((g) => g.category)))];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[11px] px-2 py-0.5 border border-border-light bg-muted text-muted-foreground">
      {label}
    </span>
  );
}

export default function GuidesPage() {
  const [category, setCategory] = useState("All");

  const filtered = guides.filter((g) => category === "All" || g.category === category);

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-black border-b border-inv-border py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-3">
            {"// DEVELOPER GUIDES"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white mb-4 uppercase">
            Guides & Tutorials
          </h1>
          <p className="text-inv-muted max-w-xl leading-relaxed font-mono text-sm">
            Step-by-step technical guides for integrating, securing, and scaling your
            payment infrastructure on Waffo.
          </p>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border-light pb-6">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "font-mono text-xs px-3 py-1.5 border transition-colors duration-75",
                category === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-muted-foreground border-border-light hover:border-black hover:text-black"
              )}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-muted-foreground self-center">
            {filtered.length} guide{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((guide) => (
            <motion.div key={guide.slug} variants={fadeInUp}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group flex flex-col h-full bg-card border border-border-light p-5 hover:border-black transition-all duration-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <CategoryBadge label={guide.category} />
                  <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {guide.readingTime} min
                  </span>
                </div>
                <h2 className="font-mono font-semibold text-foreground leading-snug mb-2 group-hover:text-black transition-colors line-clamp-2">
                  {guide.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 font-mono">
                  {guide.description}
                </p>
                <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-1.5">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-muted-foreground border border-border-light px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatDate(guide.publishedAt)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-mono">No guides found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
