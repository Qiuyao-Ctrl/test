"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { updates } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, PlusCircle, AlertTriangle, XCircle } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const TYPE_CONFIG: Record<
  string,
  { label: string; colorClass: string; dotClass: string }
> = {
  feature: {
    label: "Feature",
    colorClass: "bg-black text-white border-black",
    dotClass: "bg-black",
  },
  improvement: {
    label: "Improvement",
    colorClass: "border border-black text-black bg-transparent",
    dotClass: "bg-muted-foreground",
  },
  fix: {
    label: "Fix",
    colorClass: "bg-muted text-muted-foreground border-border-light",
    dotClass: "bg-muted-foreground",
  },
  deprecation: {
    label: "Deprecation",
    colorClass: "border-2 border-black text-black bg-transparent",
    dotClass: "bg-black",
  },
};

const CHANGE_ICONS = {
  added: PlusCircle,
  changed: CheckCircle2,
  fixed: CheckCircle2,
  deprecated: AlertTriangle,
};

const CHANGE_COLORS = {
  added: "text-black",
  changed: "text-muted-foreground",
  fixed: "text-muted-foreground",
  deprecated: "text-black",
};

const ALL_TYPES = ["All", "feature", "improvement", "fix", "deprecation"];

export default function UpdatesPage() {
  const [activeType, setActiveType] = useState("All");

  const filtered = updates.filter(
    (u) => activeType === "All" || u.type === activeType
  );

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-black border-b border-inv-border py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-3">
            {"// CHANGELOG"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white mb-4 uppercase">Updates</h1>
          <p className="text-inv-muted max-w-xl leading-relaxed font-mono text-sm">
            Every release, every change. Subscribe to get a weekly digest in your inbox.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="email"
                placeholder="developer@example.com"
                className="flex-1 px-3 py-2 bg-inv-card border border-inv-border text-sm text-white placeholder:text-inv-muted focus:outline focus:outline-1 focus:outline-white transition-colors font-mono"
              />
              <button className="bg-white hover:bg-inv-muted text-black text-sm font-mono font-medium px-4 py-2 transition-colors duration-75 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border-light">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={cn(
                "font-mono text-xs px-3 py-1.5 border transition-colors duration-75 capitalize",
                activeType === t
                  ? "bg-black text-white border-black"
                  : "bg-white text-muted-foreground border-border-light hover:border-black hover:text-black"
              )}
            >
              {t === "All" ? "All types" : TYPE_CONFIG[t]?.label ?? t}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-muted-foreground self-center">
            {filtered.length} release{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-[28px] top-0 bottom-0 w-px bg-black hidden sm:block" />

          <div className="space-y-8">
            {filtered.map((update) => {
              const typeConf = TYPE_CONFIG[update.type];
              return (
                <motion.div
                  key={update.version}
                  variants={fadeInUp}
                  className="relative sm:pl-16"
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-5 top-4 w-3.5 h-3.5 border-2 border-white hidden sm:block",
                      typeConf.dotClass
                    )}
                  />

                  <div className="bg-card border border-black overflow-hidden transition-colors">
                    {/* Header */}
                    <div className="flex flex-wrap items-start gap-3 p-5 border-b border-border-light bg-muted/20">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="font-mono text-sm font-bold text-white bg-black border border-black px-2.5 py-1">
                            {update.version}
                          </span>
                          <span
                            className={cn(
                              "font-mono text-[11px] px-2 py-0.5 border",
                              typeConf.colorClass
                            )}
                          >
                            {typeConf.label}
                          </span>
                        </div>
                        <h2 className="font-mono font-bold text-foreground text-lg leading-snug">
                          {"// "}{update.title}
                        </h2>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground whitespace-nowrap pt-1">
                        {formatDate(update.date)}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-mono">
                        {update.description}
                      </p>

                      {/* Change list */}
                      <div className="space-y-2">
                        {update.changes.map((change, i) => {
                          const Icon = CHANGE_ICONS[change.type] ?? CheckCircle2;
                          return (
                            <div key={i} className="flex items-start gap-2.5">
                              <Icon
                                className={cn(
                                  "w-4 h-4 mt-0.5 shrink-0",
                                  CHANGE_COLORS[change.type]
                                )}
                              />
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <span
                                  className={cn(
                                    "font-mono text-[10px] px-1.5 py-0.5 shrink-0 mt-0.5 capitalize border",
                                    change.type === "added" && "bg-black text-white border-black",
                                    change.type === "changed" && "bg-muted text-muted-foreground border-border-light",
                                    change.type === "fixed" && "bg-muted text-muted-foreground border-border-light",
                                    change.type === "deprecated" && "border-black text-black bg-transparent"
                                  )}
                                >
                                  [{change.type}]
                                </span>
                                <span className="text-sm text-muted-foreground leading-relaxed font-mono">
                                  {change.text}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-mono">No releases match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
